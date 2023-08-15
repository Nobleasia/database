/* eslint-disable camelcase, object-shorthand, no-plusplus, no-await-in-loop, no-restricted-syntax, no-loop-func */
import ExcelJS from "exceljs"

import { dateFormatter } from "@/utils"

export const generateExcel = async (
  data,
  columns,
  instance,
  watchSelectedColumns
) => {
  const dataArray = data?.data?.attributes ?? []

  const headerColorCode = "B4C6E7"

  let selectedColumns = watchSelectedColumns
  if (selectedColumns[0] === "all") {
    // If "all" is selected, include all columns except the first one ("all")
    selectedColumns = columns.slice(0).map((column) => column.label)
  } else {
    selectedColumns = selectedColumns.map((column) => {
      const matchingColumn = columns.find((col) => col.value === column)
      return matchingColumn ? matchingColumn.label : null
    })
  }

  const titleHeader = [null, "Property View"]
  const dateHeader = [null, "Date:", dateFormatter(new Date().toLocaleString())]
  const typeHeader = [null, "Property Type:", "Home"]

  const dataHeader = ["Kode Propar", ...selectedColumns]

  const rows = []

  const filteredColumns = columns.filter((column) =>
    selectedColumns.includes(column.label)
  )

  dataArray.forEach((item) => {
    const kodeProparRow = filteredColumns.map((column) => {
      const value = item[column.value]
      if (column.value === "facilities" && value) {
        return value
          .map((facility) => facility.property_facility_name.facility_name)
          .join(", ")
      }
      return value === null || value === "" || value === "null"
        ? "No Information"
        : value
    })

    kodeProparRow.unshift(item.kode_propar)

    rows.push(kodeProparRow)
  })
  rows.push("")

  const photosHeader = ["No", "Photos"]
  let maxPhotosCount = 0
  dataArray.forEach((item) => {
    if (item.photos.length > maxPhotosCount) {
      maxPhotosCount = item.photos.length
    }
  })

  for (let i = 1; i <= maxPhotosCount; i++) {
    photosHeader.push(i.toString())
  }

  rows.push(photosHeader)

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Property Data")
  worksheet.addRows([
    [],
    titleHeader,
    dateHeader,
    typeHeader,
    dataHeader,
    ...rows,
  ])
  worksheet.mergeCells("B2:C2")
  worksheet.getCell("B2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: headerColorCode },
  }
  worksheet.getCell("B2").alignment = {
    vertical: "middle",
    horizontal: "center",
  }
  worksheet.getCell("B2").font = {
    bold: true,
  }
  worksheet.getCell("B3").alignment = {
    vertical: "middle",
    horizontal: "right",
  }
  worksheet.getCell("B3").font = {
    bold: true,
  }
  worksheet.getCell("B4").alignment = {
    vertical: "middle",
    horizontal: "right",
  }
  worksheet.getCell("B4").font = {
    bold: true,
  }
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell((cell) => {
      if (cell.value !== null && cell.value !== undefined) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      }
    })
  })

  worksheet.getRow(5).eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: headerColorCode },
    }
    cell.font = {
      bold: true,
    }
  })

  worksheet.getRow(8).eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: headerColorCode },
    }
    cell.font = {
      bold: true,
    }
  })

  for (let i = 0; i < dataArray.length; i++) {
    const totalRow = dataArray.length
    const item = dataArray[i]
    const kodeProparRow = [item.kode_propar]

    if (item.photos.length === 0) {
      worksheet.getCell(`A${i + totalRow + 8}`).value = i + 1
      worksheet.getCell(`A${i + totalRow + 8}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      }
      worksheet.getCell(`B${i + totalRow + 8}`).value = item.kode_propar
      worksheet.getCell(`B${i + totalRow + 8}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      }
      worksheet.getCell(`C${i + totalRow + 8}`).value = "No photos selected"
      worksheet.getCell(`C${i + totalRow + 8}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      }
    } else {
      for (let j = 0; j < item.photos.length; j++) {
        const photo = item.photos[j]
        try {
          const response = await instance.get(photo.photo_url, {
            responseType: "arraybuffer",
          })
          const imageBuffer = Buffer.from(response.data, "binary")

          const imageBase64 = imageBuffer.toString("base64")
          const imageExtension = ".jpg" // Modify the extension based on the image format

          // Insert the image into the worksheet
          const imageId = workbook.addImage({
            base64: imageBase64,
            extension: imageExtension,
          })
          worksheet.getRow(i + totalRow + 8).height = 75

          worksheet.getCell(`A${i + totalRow + 8}`).value = i + 1
          worksheet.getCell(`A${i + totalRow + 8}`).alignment = {
            vertical: "middle",
            horizontal: "center",
          }
          worksheet.getCell(`B${i + totalRow + 8}`).value = item.kode_propar
          worksheet.getCell(`B${i + totalRow + 8}`).alignment = {
            vertical: "middle",
            horizontal: "center",
          }

          worksheet.addImage(imageId, {
            tl: { col: j + 2, row: i + totalRow + 7 },
            br: { col: j + 3, row: i + totalRow + 8 },
          })
        } catch (error) {
          console.error("Error fetching image:", error)
        }
      }
    }

    rows.push(kodeProparRow)
  }

  // Set column width to 150 for all columns
  worksheet.columns.forEach((column) => {
    column.width = 25
  })

  // Set row height to 150 for all rows
  const currentDate = new Date().toLocaleString().replace(/[\s/:]/g, "-")

  const workbookBlob = await workbook.xlsx.writeBuffer()
  const blob = new Blob([workbookBlob], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const excelFileName = `PROPERTY_PARTIALAN_${currentDate}.xlsx`

  // Convert Blob to Data URL
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = excelFileName
    link.click()
  }
  reader.readAsDataURL(blob)
}
