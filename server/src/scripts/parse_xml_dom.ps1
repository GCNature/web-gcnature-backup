$destFolder = "c:\Users\WEB GCNATURE\Web - GCnature\server\src\scripts\temp_xlsx"
$sharedStringsXml = [xml](Get-Content -Path "$destFolder\xl\sharedStrings.xml" -Raw -Encoding utf8)
$sheetXml = [xml](Get-Content -Path "$destFolder\xl\worksheets\sheet1.xml" -Raw -Encoding utf8)

# Load shared strings into an array
$sharedStrings = @()
foreach ($sst in $sheetXml.SelectNodes("//*[local-name()='sst']")) {
    # Handled below
}
foreach ($t in $sharedStringsXml.SelectNodes("//*[local-name()='t']")) {
    $sharedStrings += $t.InnerText
}

$grid = @{}

# Parse cells using XPath
# The cell elements are <c>
$nsManager = New-Object System.Xml.XmlNamespaceManager($sheetXml.NameTable)
$nsManager.AddNamespace("x", $sheetXml.DocumentElement.NamespaceURI)

$cells = $sheetXml.SelectNodes("//x:c", $nsManager)
foreach ($c in $cells) {
    $r = $c.GetAttribute("r")
    $t = $c.GetAttribute("t")
    
    # Extract column letter and row number from coordinate e.g. A1, B2, AA12
    if ($r -match "^([A-Z]+)(\d+)$") {
        $col = $matches[1]
        $row = [int]$matches[2]
        
        $vNode = $c.SelectSingleNode("x:v", $nsManager)
        $val = ""
        if ($vNode) {
            $val = $vNode.InnerText
        }
        
        if ($t -eq "s" -and $val -ne "") {
            $realVal = $sharedStrings[[int]$val]
        } else {
            $realVal = $val
        }
        
        if (-not $grid.ContainsKey($row)) {
            $grid[$row] = @{}
        }
        $grid[$row][$col] = $realVal
    }
}

# Output as CSV
$maxCol = "E"
$sortedRows = $grid.Keys | Sort-Object
$csvContent = @()
$csvContent += "Row,Col A,Col B,Col C,Col D,Col E"

foreach ($r in $sortedRows) {
    $rowVals = @()
    foreach ($co in @("A","B","C","D","E")) {
        $val = ""
        if ($grid[$r].ContainsKey($co)) {
            $val = $grid[$r][$co]
        }
        # Escape quotes for CSV
        $val = $val -replace '"', '""'
        $rowVals += """$val"""
    }
    $csvContent += "$r,$($rowVals -join ',')"
}

$csvContent | Out-File -FilePath "c:\Users\WEB GCNATURE\Web - GCnature\server\src\scripts\sheet_table.csv" -Encoding utf8
Write-Host "CSV generated successfully."
