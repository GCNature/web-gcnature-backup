Add-Type -AssemblyName System.IO.Compression.FileSystem

$doiTacFolder = Get-ChildItem -Path "c:\Users\WEB GCNATURE\Web - GCnature" -Directory | Where-Object { $_.Name -like "*t*c*" -and $_.Name -notlike "*s*" }
$xlsxFile = Get-ChildItem -Path $doiTacFolder.FullName -Filter "*.xlsx"
$xlsxPath = $xlsxFile.FullName
Write-Host "Found Excel path: $xlsxPath"
$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)

# 1. Read shared strings
$sharedStringsEntry = $zip.Entries | Where-Object { $_.FullName -eq "xl/sharedStrings.xml" }
$sharedStrings = @()
if ($sharedStringsEntry) {
    $stream = $sharedStringsEntry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xmlContent = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    
    # Extract all <t>...</t> tags
    $matches = [regex]::Matches($xmlContent, "<t.*?>(.*?)</t>")
    foreach ($m in $matches) {
        $sharedStrings += $m.Groups[1].Value
    }
    $sharedStrings | ConvertTo-Json | Out-File -FilePath "c:\Users\WEB GCNATURE\Web - GCnature\server\src\scripts\shared_strings.json" -Encoding utf8
}

# 2. Read sheet1.xml
$sheetEntry = $zip.Entries | Where-Object { $_.FullName -eq "xl/worksheets/sheet1.xml" }
if ($sheetEntry) {
    $stream = $sheetEntry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xmlContent = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()

    # Simple regex parsing for <row>...</row>
    $rows = [regex]::Matches($xmlContent, "<row.*?>(.*?)</row>")
    Write-Host "Total rows found: $($rows.Count)"
    
    $parsedRows = @()
    foreach ($r in $rows) {
        $rowData = @{}
        $cells = [regex]::Matches($r.Groups[1].Value, "<c r=""([A-Z]+)(\d+)""(?: t=""(.*?""))?.*?>(?:<v>(.*?)</v>)?</c>")
        foreach ($c in $cells) {
            $col = $c.Groups[1].Value
            $type = $c.Groups[3].Value
            $val = $c.Groups[4].Value
            
            if ($type -eq "s") {
                $idx = [int]$val
                $realVal = $sharedStrings[$idx]
            } else {
                $realVal = $val
            }
            $rowData[$col] = $realVal
        }
        if ($rowData.Keys.Count -gt 0) {
            $parsedRows += $rowData
        }
    }
    
    $json = $parsedRows | ConvertTo-Json -Depth 4
    $outputPath = "c:\Users\WEB GCNATURE\Web - GCnature\server\src\scripts\parsed_policy.json"
    $json | Out-File -FilePath $outputPath -Encoding utf8
    Write-Host "Successfully parsed Excel file to: $outputPath"
}

$zip.Dispose()
