const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const {
  accessTokenValidator,
  errorHandler,
  getUsername,
  adminValidator,
} = require("./middleware");

const deleteExpiredData = require("./utils/delete_expired_data");

const {
  registerRouter,
  loginRouter,
  refreshTokenRouter,
  accessTokenValidatorRouter,
  logoutRouter,
  readUserRouter,
  updateUserRouter,
  deleteUserRouter,
} = require("./controllers/users");

const {
  createNewPropertyAreaRouter,
  readPropertyAreaRouter,
  updatePropertyAreaRouter,
  deletePropertyAreaRouter,
} = require("./controllers/property/areas");

const {
  createNewPropertyFacilityNameRouter,
  readPropertyFacilityNameRouter,
  updatePropertyFacilityNameRouter,
  deletePropertyFacilityNameRouter,
} = require("./controllers/property/facility_names");

const {
  createNewPropertyPersonInChargeCompanyRouter,
  readPropertyPersonInChargeCompanyRouter,
  updatePropertyPersonInChargeCompanyRouter,
  deletePropertyPersonInChargeCompanyRouter,
  restorePropertyPersonInChargeCompanyRouter,
} = require("./controllers/property/person_in_charge_company");

const {
  createNewPropertyPersonInChargeRoleRouter,
  readPropertyPersonInChargeRoleRouter,
  updatePropertyPersonInChargeRoleRouter,
  deletePropertyPersonInChargeRoleRouter,
  restorePropertyPersonInChargeRoleRouter,
} = require("./controllers/property/person_in_charge_roles");

const {
  createNewPropertyPersonInChargeRouter,
  readPropertyPersonInChargeRouter,
  updatePropertyPersonInChargeRouter,
  deletePropertyPersonInChargeRouter,
  restorePropertyPersonInChargeRouter,
} = require("./controllers/property/person_in_charges");

const {
  createNewPropertyPaymentTermRouter,
  readPropertyPaymentTermRouter,
  updatePropertyPaymentTermRouter,
  deletePropertyPaymentTermRouter,
} = require("./controllers/property/payment_terms");

const {
  createNewApartmentRouter,
  readApartmentRouter,
  readApartmentKodeProparRouter,
  updateApartmentRouter,
  deleteApartmentRouter,
  restoreApartmentRouter,
} = require("./controllers/apartment/apartments");

const {
  createNewOfficeRouter,
  deleteOfficeRouter,
  updateOfficeRouter,
  readOfficeRouter,
  readOfficeKodeProparRouter,
} = require("./controllers/offices");

const {
  createNewHomeRouter,
  readHomeRouter,
  readHomeKodeProparRouter,
  updateHomeRouter,
  deleteHomeRouter,
} = require("./controllers/homes");

const {
  createNewLandRouter,
  readLandRouter,
  readLandKodeProparRouter,
  updateLandRouter,
  deleteLandRouter,
} = require("./controllers/lands");

const {
  createNewPropertyPartialanRouter,
  readPropertyPartialanRouter,
  createExcelPdfDataRouter,
} = require("./controllers/property_partialans");

const {
  propertyAnalyticsRouter,
  logsRouter,
} = require("./controllers/analytics");

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const corsOptions = {
  origin: [
    "https://database.nobleasia.id",
    "http://202.157.185.91:3000",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("NA Database API is running 🥳");
});

app.use("/static", express.static(path.join(__dirname, "assets")));

app.use("/users/login", loginRouter);

app.use("/users/refresh_token", refreshTokenRouter);
app.use("/users/access_token", accessTokenValidatorRouter);

app.use("/analytics/properties", propertyAnalyticsRouter);

app.use("/property_partialan/public_link/read", readPropertyPartialanRouter);

//API that needs access token validation
app.use(accessTokenValidator);

app.use("/users/logout", logoutRouter);

app.use(getUsername);

app.use("/property/areas/create", createNewPropertyAreaRouter);
app.use("/property/areas/read", readPropertyAreaRouter);
app.use("/property/areas/update", updatePropertyAreaRouter);
app.use("/property/areas/delete", deletePropertyAreaRouter);

app.use("/property/facility_names/create", createNewPropertyFacilityNameRouter);
app.use("/property/facility_names/read", readPropertyFacilityNameRouter);
app.use("/property/facility_names/update", updatePropertyFacilityNameRouter);
app.use("/property/facility_names/delete", deletePropertyFacilityNameRouter);

app.use(
  "/property/person_in_charge_companies/create",
  createNewPropertyPersonInChargeCompanyRouter,
);
app.use(
  "/property/person_in_charge_companies/read",
  readPropertyPersonInChargeCompanyRouter,
);
app.use(
  "/property/person_in_charge_companies/update",
  updatePropertyPersonInChargeCompanyRouter,
);
app.use(
  "/property/person_in_charge_companies/delete",
  deletePropertyPersonInChargeCompanyRouter,
);
app.use(
  "/property/person_in_charge_companies/restore",
  restorePropertyPersonInChargeCompanyRouter,
);

app.use(
  "/property/person_in_charge_roles/create",
  createNewPropertyPersonInChargeRoleRouter,
);
app.use(
  "/property/person_in_charge_roles/read",
  readPropertyPersonInChargeRoleRouter,
);
app.use(
  "/property/person_in_charge_roles/update",
  updatePropertyPersonInChargeRoleRouter,
);
app.use(
  "/property/person_in_charge_roles/delete",
  deletePropertyPersonInChargeRoleRouter,
);
app.use(
  "/property/person_in_charge_roles/restore",
  restorePropertyPersonInChargeRoleRouter,
);

app.use(
  "/property/person_in_charges/create",
  createNewPropertyPersonInChargeRouter,
);
app.use("/property/person_in_charges/read", readPropertyPersonInChargeRouter);
app.use(
  "/property/person_in_charges/update",
  updatePropertyPersonInChargeRouter,
);
app.use(
  "/property/person_in_charges/delete",
  deletePropertyPersonInChargeRouter,
);
app.use(
  "/property/person_in_charges/restore",
  restorePropertyPersonInChargeRouter,
);

app.use("/property/payment_terms/create", createNewPropertyPaymentTermRouter);
app.use("/property/payment_terms/read", readPropertyPaymentTermRouter);
app.use("/property/payment_terms/update", updatePropertyPaymentTermRouter);
app.use("/property/payment_terms/delete", deletePropertyPaymentTermRouter);

app.use("/apartment/create", createNewApartmentRouter);
app.use("/apartment/read", readApartmentRouter);
app.use("/apartment/read/kode_propar", readApartmentKodeProparRouter);
app.use("/apartment/update", updateApartmentRouter);
app.use("/apartment/delete", deleteApartmentRouter);
app.use("/apartment/restore", restoreApartmentRouter);

app.use("/office/create", createNewOfficeRouter);
app.use("/office/update", updateOfficeRouter);
app.use("/office/delete", deleteOfficeRouter);
app.use("/office/read", readOfficeRouter);
app.use("/office/read/kode_propar", readOfficeKodeProparRouter);

app.use("/home/create", createNewHomeRouter);
app.use("/home/read", readHomeRouter);
app.use("/home/read/kode_propar", readHomeKodeProparRouter);
app.use("/home/update", updateHomeRouter);
app.use("/home/delete", deleteHomeRouter);

app.use("/land/create", createNewLandRouter);
app.use("/land/read", readLandRouter);
app.use("/land/read/kode_propar", readLandKodeProparRouter);
app.use("/land/update", updateLandRouter);
app.use("/land/delete", deleteLandRouter);

app.use(
  "/property_partialan/public_link/create",
  createNewPropertyPartialanRouter,
);

app.use("/property_partialan/excel_pdf/create", createExcelPdfDataRouter);

app.use(adminValidator);

app.use("/users/register", registerRouter);
app.use("/users/read", readUserRouter);
app.use("/users/update", updateUserRouter);
app.use("/users/delete", deleteUserRouter);

app.use("/logs/read", logsRouter);

deleteExpiredData();

const main = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

app.use(errorHandler);

main();
