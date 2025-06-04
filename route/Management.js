const path = require('path');
const express = require('express');
const Management = express.Router();
const { Dicts } = require('../sqlServices/sequelize.js')
const { DictsCategory } = require('../sqlServices/sequelize.js');
const { doAutoRPC } = require('../utils/rpc.js')

const RPCconfig = [{
    model: Dicts,
    link: DictsCategory
}]
doAutoRPC(Management, RPCconfig)
console.log(Dicts, 123, path.basename(__filename));

module.exports = Management;