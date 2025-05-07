"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Printer } from "lucide-react"
import { generateCutList, type CutList } from "@/utils/cut-list-generator"
import type { Dimensions } from "@/types/furniture-types"

interface CutListModalProps {
  furnitureType: string
  dimensions: Dimensions
  hasDoors: boolean
  shelfCount: number
  columnCount: number
  materialCategory: string
  materialOption: string
}

export function CutListModal({
  furnitureType,
  dimensions,
  hasDoors,
  shelfCount,
  columnCount,
  materialCategory,
  materialOption,
}: CutListModalProps) {
  const [cutList, setCutList] = useState<CutList | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (open && !cutList) {
      // Generate the cut list when the modal is opened
      const generatedCutList = generateCutList(
        furnitureType,
        dimensions,
        hasDoors,
        shelfCount,
        columnCount,
        `${materialCategory}_${materialOption}`,
        "H1334_9", // Default door material code
        "W1000_9", // Default back panel code
      )
      setCutList(generatedCutList)
    }
  }

  const downloadCutListPDF = () => {
    // In a real implementation, this would generate a PDF
    // For now, we'll just create a text file with the cut list data
    if (!cutList) return

    const content = generateCutListText(cutList)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${furnitureType}-cut-list.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printCutList = () => {
    window.print()
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Cut List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cut List for {furnitureType.charAt(0).toUpperCase() + furnitureType.slice(1)}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={downloadCutListPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={printCutList}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogHeader>

        {cutList && (
          <Tabs defaultValue="materials">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
            </TabsList>

            <TabsContent value="materials">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Area</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cutList.materials.map((material, index) => (
                      <TableRow key={index}>
                        <TableCell>{material.type}</TableCell>
                        <TableCell>
                          {material.width}x{material.height}x{material.thickness} mm
                        </TableCell>
                        <TableCell>{material.code}</TableCell>
                        <TableCell>{material.count} pcs</TableCell>
                        <TableCell>{material.area.toFixed(3)} m²</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Summary</h3>
                <p className="text-sm">Total material area: {cutList.totalArea.toFixed(3)} m²</p>
                <p className="text-sm">Total edge banding: {cutList.totalEdgeBanding.toFixed(2)} m</p>
              </div>
            </TabsContent>

            <TabsContent value="parts">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Edge Banding</TableHead>
                      <TableHead>Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cutList.parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>{part.id}</TableCell>
                        <TableCell>{part.description}</TableCell>
                        <TableCell>{part.material}</TableCell>
                        <TableCell>
                          {part.width} x {part.height} x {part.thickness} mm
                        </TableCell>
                        <TableCell>{part.edgeBanding.length > 0 ? part.edgeBanding.join(", ") : "None"}</TableCell>
                        <TableCell>{part.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="hardware">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cutList.hardware.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.count} pcs</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

function generateCutListText(cutList: CutList): string {
  let content = "CUT LIST SPECIFICATION\n\n"

  // Materials section
  content += "MATERIALS:\n"
  cutList.materials.forEach((material) => {
    content += `${material.type} ${material.width}x${material.height}x${material.thickness} (${material.code}) - ${material.count} pcs. (${material.area.toFixed(3)} m²)\n`
  })
  content += "\n"

  // Hardware section
  content += "HARDWARE:\n"
  cutList.hardware.forEach((item) => {
    content += `${item.type} - ${item.count} pcs.\n`
  })
  content += "\n"

  // Parts section
  content += "PARTS:\n"
  cutList.parts.forEach((part) => {
    content += `No${part.id} - ${part.width} x ${part.height} (${part.description})\n`
  })
  content += "\n"

  // Summary
  content += "SUMMARY:\n"
  content += `Total material area: ${cutList.totalArea.toFixed(3)} m²\n`
  content += `Total edge banding: ${cutList.totalEdgeBanding.toFixed(2)} m\n`

  return content
}
