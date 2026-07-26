const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const xlsxPath = "C:\\Users\\webMercy\\Downloads\\Thông tin sản phẩm.xlsx";
  const psScript = `
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $path = "C:\\Users\\webMercy\\Downloads\\Thông tin sản phẩm.xlsx"
    $tempDir = Join-Path $env:TEMP ([Guid]::NewGuid().ToString())
    [System.IO.Compression.ZipFile]::ExtractToDirectory($path, $tempDir)

    $strings = @()
    $stringsFile = Join-Path $tempDir "xl\\sharedStrings.xml"
    if (Test-Path $stringsFile) {
        [xml]$xmlStrings = Get-Content $stringsFile -Encoding UTF8
        $strings = $xmlStrings.getElementsByTagName("t") | ForEach-Object { $_.InnerText }
    }

    $sFile = Join-Path $tempDir "xl\\worksheets\\sheet1.xml"
    [xml]$sXml = Get-Content $sFile -Encoding UTF8
    $rows = $sXml.getElementsByTagName("row")

    $parsed = @()
    foreach ($r in $rows) {
        $rowObj = [ordered]@{}
        foreach ($c in $r.c) {
            $colLetter = $c.r -replace '[0-9]', ''
            $v = $c.v
            $t = $c.t
            if ($t -eq "s" -and $v -ne $null) {
                $idx = [int]$v
                if ($idx -lt $strings.Count) { $cellVal = $strings[$idx] } else { $cellVal = $v }
            } else {
                $cellVal = $v
            }
            $rowObj[$colLetter] = $cellVal
        }
        $parsed += $rowObj
    }
    Remove-Item $tempDir -Recurse -Force
    $parsed | ConvertTo-Json -Depth 5
  `;

  const jsonStr = execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const rows = JSON.parse(jsonStr.replace(/^\uFEFF/, ''));

  const validProducts = rows.filter(r => r.C && r.B && r.C !== 'SKU' && r.B !== 'Tên Sản Phẩm');
  console.log(`Found ${validProducts.length} product rows.`);

  for (const r of validProducts) {
    const sku = String(r.C).trim();
    const volume = r.J ? String(r.J).trim() : '';
    const ingredients = r.H ? String(r.H).trim() : '';

    await prisma.products.updateMany({
      where: { sku: sku },
      data: {
        volume: volume || null,
        ingredients: ingredients || null
      }
    });

    console.log(`Updated SKU ${sku}: Volume='${volume}', Ingredients='${ingredients.substring(0, 40)}...'`);
  }

  console.log("SUCCESSFULLY POPULATED Volume & Ingredients!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
