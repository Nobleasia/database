/* eslint-disable no-nested-ternary */
import {
  Document,
  Font,
  Image,
  Page,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer"
import { saveAs } from "file-saver"

import { convertNumberToPriceFormat } from "@/utils"

export const generatePDF = async (response, instance) => {
  const currentDate = new Date()
  const options = { day: "numeric", month: "long", year: "numeric" }
  const formattedDate = currentDate.toLocaleDateString("id-ID", options)

  Font.register({
    family: "Inter",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf",
        fontWeight: 100,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf",
        fontWeight: 200,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
        fontWeight: 300,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
        fontWeight: 500,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
        fontWeight: 600,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
        fontWeight: 700,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf",
        fontWeight: 800,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
        fontWeight: 900,
      },
    ],
  })

  const propertyData = await Promise.all(
    response.data.attributes.map(async (property) => {
      const photos = await Promise.all(
        property.photos.map(async (photo) => {
          const response = await instance.get(photo.photo_url, {
            responseType: "arraybuffer",
          })
          const blob = new Blob([response.data], { type: "image/jpeg" })
          const imageUrl = URL.createObjectURL(blob)
          return imageUrl
        })
      )

      return { ...property, photos }
    })
  )

  const PropertyDocument = (
    <Document>
      {propertyData.map((property) => (
        <Page
          key={property.kode_propar}
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            flexDirection: "column",
            padding: 24,
            fontFamily: "Inter",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Image
              key="logo"
              src="https://database.nobleasia.id/images/npa-logo-full.png"
              style={{ width: 200, height: 50, objectFit: "cover" }}
            />
            <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                {property.kode_propar} - Property Details
              </Text>
              <Text style={{ fontSize: 10 }}>Date: {formattedDate}</Text>
              <Text style={{ fontSize: 10 }}>Type of Property: Office</Text>
            </View>
          </View>
          <View
            style={{
              width: 547,
              height: 2,
              backgroundColor: "#9AA4B2",
              marginTop: 16,
              marginBottom: 12,
            }}
          />

          <View style={{ width: 547, height: 248, marginBottom: 16 }}>
            {property.photos.length === 0 ? (
              <Text
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: "bold",
                  height: "100%",
                  weight: "100%",
                }}
              >
                No Photos Available
              </Text>
            ) : property.photos.length === 1 ? (
              <Image
                key={`photo-${property.photos[0].photo_id}`}
                src={property.photos[0]}
                style={{ width: "100%", borderRadius: 4 }}
              />
            ) : property.photos.length === 2 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <Image
                  key={`photo-${property.photos[0].photo_id}`}
                  src={property.photos[0]}
                  style={{
                    flex: 1,
                    borderRadius: 4,
                    objectFit: "cover",
                  }}
                />
                <Image
                  key={`photo-${property.photos[1].photo_id}`}
                  src={property.photos[1]}
                  style={{
                    flex: 1,
                    borderRadius: 4,
                    objectFit: "cover",
                  }}
                />
              </View>
            ) : property.photos.length === 3 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>

                <Image
                  key={`photo-${property.photos[2].photo_id}`}
                  src={property.photos[2]}
                  style={{
                    flex: 1,
                    borderRadius: 4,
                    objectFit: "cover",
                  }}
                />
              </View>
            ) : property.photos.length === 4 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : property.photos.length === 5 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[4].photo_id}`}
                    src={property.photos[4]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : property.photos.length === 6 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[4].photo_id}`}
                    src={property.photos[4]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[5].photo_id}`}
                    src={property.photos[5]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : property.photos.length === 7 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[4].photo_id}`}
                    src={property.photos[4]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[5].photo_id}`}
                    src={property.photos[5]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[6].photo_id}`}
                    src={property.photos[6]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : property.photos.length === 8 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[4].photo_id}`}
                    src={property.photos[4]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[5].photo_id}`}
                    src={property.photos[5]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[6].photo_id}`}
                    src={property.photos[6]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[7].photo_id}`}
                    src={property.photos[7]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : property.photos.length === 9 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[4].photo_id}`}
                    src={property.photos[4]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[5].photo_id}`}
                    src={property.photos[5]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[6].photo_id}`}
                    src={property.photos[6]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[7].photo_id}`}
                    src={property.photos[7]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[8].photo_id}`}
                    src={property.photos[7]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : property.photos.length === 10 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[0].photo_id}`}
                    src={property.photos[0]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[1].photo_id}`}
                    src={property.photos[1]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[2].photo_id}`}
                    src={property.photos[2]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[3].photo_id}`}
                    src={property.photos[3]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[4].photo_id}`}
                    src={property.photos[4]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <Image
                    key={`photo-${property.photos[5].photo_id}`}
                    src={property.photos[5]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[6].photo_id}`}
                    src={property.photos[6]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[7].photo_id}`}
                    src={property.photos[7]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[8].photo_id}`}
                    src={property.photos[8]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    key={`photo-${property.photos[9].photo_id}`}
                    src={property.photos[9]}
                    style={{
                      flex: 1,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {property.photos.map((photo) => (
                  <Image
                    key={`photo-${photo.photo_id}`}
                    src={photo}
                    style={{
                      width: "50%",
                      height: 124,
                      borderRadius: 4,
                      marginBottom: 4,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "55%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ display: "flex", flexDirection: "column", width: 340 }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: "#434953",
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#FCFCFD",
                        fontWeight: "medium",
                      }}
                    >
                      {property.property_area.region_name}
                    </Text>
                  </View>
                  {property.furnishing && (
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: "#3267E3",
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FCFCFD",
                          fontWeight: "medium",
                        }}
                      >
                        {property.furnishing}
                      </Text>
                    </View>
                  )}

                  {property.available && (
                    <View
                      style={[
                        {
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 4,
                        },
                        property.available === "Yes"
                          ? { backgroundColor: "#3CCB7F" }
                          : { backgroundColor: "#F97066" },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FCFCFD",
                          fontWeight: "medium",
                        }}
                      >
                        {property.available === "Yes"
                          ? "Available"
                          : "Not Available"}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    marginBottom: 8,
                    color: "#3267E3",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {property.selling_price !== 0
                    ? `${convertNumberToPriceFormat(
                        property.selling_price,
                        property.price_currency
                      )} /sqm`
                    : `${convertNumberToPriceFormat(
                        property.rental_price,
                        property.price_currency
                      )} /sqm/mo`}
                </Text>
                {property.name && (
                  <Text
                    style={{
                      marginBottom: 4,
                      color: "#966C8A",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {property.name}
                  </Text>
                )}
                {property.address && (
                  <Text
                    style={{ marginBottom: 16, color: "#121926", fontSize: 12 }}
                  >
                    {property.address}
                  </Text>
                )}

                {(property.building_completion || property.certificates) && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "#0D0F11",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Info
                    </Text>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 16 }}
                    >
                      {property.building_completion && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                              Building Completion
                            </Text>
                            <Text style={{ fontSize: 10 }}>
                              {property.building_completion}
                            </Text>
                          </View>
                        </View>
                      )}

                      {property.certificates && (
                        <View
                          style={{
                            width: "50%",
                            display: "flex",
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                              Certificates
                            </Text>
                            <Text style={{ fontSize: 10 }}>
                              {property.certificates}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {property.facilities && (
                  <View>
                    <Text
                      style={{
                        color: "#0D0F11",
                        fontSize: 12,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      Facilities
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        flexWrap: "wrap",
                        gap: 4,
                      }}
                    >
                      {property.facilities && property.facilities.length > 0 ? (
                        property.facilities.slice(0, 4).map((item) => (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <Text
                              key={item.id}
                              style={{
                                fontSize: 10,
                                fontWeight: "500",
                                paddingRight: "1%",
                              }}
                            >
                              -
                            </Text>
                            <Text
                              key={item.id}
                              style={{
                                width: "25%",
                                fontSize: 10,
                                fontWeight: "500",
                                paddingRight: "1%",
                                flexWrap: "wrap",
                              }}
                            >
                              {item.property_facility_name.facility_name}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text
                          style={{
                            color: "#0D0F11",
                            fontSize: 10,
                            marginBottom: 4,
                          }}
                        >
                          No facilities found
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 230,
                  gap: 8,
                }}
              >
                {(property.semi_gross_area ||
                  property.parking_ratio ||
                  property.floor ||
                  property.grade) && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#0D0F11",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Specification
                    </Text>
                    <View
                      style={{
                        width: 174,
                        height: 1,
                        backgroundColor: "#9AA4B2",
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    />
                    {property.semi_gross_area && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Semi Gross Area
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {property.semi_gross_area} sqm
                        </Text>
                      </View>
                    )}
                    {property.parking_ratio && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Parking Ratio
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {property.parking_ratio} sqm
                        </Text>
                      </View>
                    )}
                    {property.floor && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Floor
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {property.floor}
                        </Text>
                      </View>
                    )}
                    {property.grade && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Grade
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {property.grade}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {(property.property_payment_term.payment_term ||
                  property.lease_term_time ||
                  property.vat_details ||
                  property.wht_details ||
                  property.rental_price ||
                  property.selling_price ||
                  property.service_charge_price ||
                  property.overtime_price ||
                  property.security_deposit) && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#0D0F11",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Pricing & Terms
                    </Text>
                    <View
                      style={{
                        width: 174,
                        height: 1,
                        backgroundColor: "#9AA4B2",
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    />
                    {property.property_payment_term.payment_term && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Payment Term
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {property.property_payment_term.payment_term}
                        </Text>
                      </View>
                    )}

                    {property.lease_term_time && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Lease Term
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {`${property.lease_term_time} ${
                            property.lease_term_time > 1
                              ? `${property.lease_term_type}(s)`
                              : property.lease_term_type
                          }`}
                        </Text>
                      </View>
                    )}

                    {(property.vat_details || property.wht_details) && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Tax Fee
                        </Text>
                        <View
                          style={{
                            width: "50%",
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            gap: 2,

                            marginBottom: 8,
                          }}
                        >
                          {property.vat_details && (
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: "700",
                              }}
                            >
                              {property.vat_details}
                            </Text>
                          )}
                          {property.wht_details && (
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: "700",
                              }}
                            >
                              {property.wht_details}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    {property.rental_price && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Rental Price
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {convertNumberToPriceFormat(
                            property.rental_price,
                            property.price_currency
                          )}{" "}
                          /sqm/mo
                        </Text>
                      </View>
                    )}

                    {property.selling_price && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Selling Price
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {convertNumberToPriceFormat(
                            property.selling_price,
                            property.price_currency
                          )}{" "}
                          /sqm
                        </Text>
                      </View>
                    )}

                    {property.service_charge_price && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Service Charge
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {convertNumberToPriceFormat(
                            property.service_charge_price,
                            property.price_currency
                          )}{" "}
                          /sqm/mo
                        </Text>
                      </View>
                    )}

                    {property.overtime_price && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Overtime
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {convertNumberToPriceFormat(
                            property.overtime_price,
                            property.price_currency
                          )}
                          /{property.overtime_time}(s)
                        </Text>
                      </View>
                    )}
                    {property.security_deposit && (
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "400",
                          }}
                        >
                          Security Deposit
                        </Text>
                        <Text
                          style={{
                            width: "50%",
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {property.security_deposit}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#F8FAFC",
                paddingHorizontal: 8,
                paddingVertical: 12,
                borderRadius: 4,
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                Contact :
              </Text>
              <Text style={{ fontSize: 10 }}>
                www.nobleasia.id | inquiry@noblepropertiesasia.com | +62
                813-1668-5505 | @noblepropertiesasia
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )

  const pdfBlob = await pdf(PropertyDocument).toBlob()

  if (pdfBlob) {
    // Save the PDF blob as a file
    saveAs(
      pdfBlob,
      `PROPERTY_PARTIALAN_${currentDate
        .toLocaleString()
        .replace(/[\s/:]/g, "_")}.pdf`
    )
  }
}
