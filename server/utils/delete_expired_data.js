const cron = require('node-cron');
const { Op } = require('sequelize');

const Log = require("../models/log");
const PropertyPartialan = require('../models/property_partialan');

async function deleteExpiredData() {
  try {
    const propertyPartialan = await PropertyPartialan.destroy({
      where: {
        expires_at: {
          [Op.lte]: new Date(),
        },
      },
    });

    if (propertyPartialan) {
      console.log('Successfully delete expired Property Partialan:', propertyPartialan.id);

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete Expired Property Partialan` });
    }

    const logs = await Log.destroy({
      where: {
        expires_at: {
          [Op.lte]: new Date(),
        },
      },
    });

    if (logs) {
      console.log('Successfully delete expired Property Partialan:', logs.id);

      await Log.create({ status_code: 204, username: 'system', message: `Delete Expired Log` });
    }
  } catch (error) {
    console.error('Gagal menghapus data yang sudah kedaluwarsa:', error);
  }
}

cron.schedule('0 0 * * *', deleteExpiredData);

module.exports = deleteExpiredData;
