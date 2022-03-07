var DecisionTree = require('decision-tree')
var _ = require('lodash')
const db = require('../util/db')
const database = db.connection
// var train_data_child = require('../models/child/train_data')
// var train_data = require('../models/training_data')

// var child = 10
// var teen = 96
// var train_child =

var class_name = 'disease'

exports.predictDisease = (req, res, next) => {
  return (req, res, next) => {
    let symptomData = req.body.symptomData
    let trainData = []
    let symptomFeatures = []
    let dataResualt = {}

    //
    let new_Data = _.groupBy(res.disease_symptom, 'diseaseName')
    res.disease.map((itemData) => {
      let data = {}
      data['disease'] = itemData.diseaseName
      res.symptom.map((item) => {
        if (new_Data[itemData.diseaseName] !== null) {
          let check = _.find(new_Data[itemData.diseaseName], [
            'symptomKey',
            item.symptomKey,
          ])

          data[item.symptomKey] = check ? true : false
        } else {
          data[item.symptomKey] = false
        }
      })
      trainData.push(data)
    })

    res.symptom.map((item) => {
      symptomFeatures.push(item.symptomKey)
    })

    res.symptom.map((item) => {
      dataResualt[item.symptomKey] = false
    })

    var dt = new DecisionTree(class_name, symptomFeatures)

    dt.train(trainData)

    let useSelect = []
    // let rawSelect = ['047', '002', '003', '004', '005']

    res.symptom.map((item) => {
      symptomData.map((itemData) => {
        if (item.symptomNumber === itemData) {
          useSelect.push(item.symptomKey)
        }
      })
    })

    let dataSelect = _.mapValues(dataResualt, function (o, k) {
      let check = useSelect.find((i) => {
        return i === k
      })
      return check ? true : false
    })

    // console.log('dataSelect',dataSelect)

    var predicted_class = dt.predict(dataSelect)

    var query = 'SELECT * from disease where diseaseName = ?'
    try {
      database.query(query, [predicted_class], function (err, rows, fields) {
        if (err) {
          throw new Error(err)
        }
        if (rows.length > 0) {
          res.data = {
            success: true,
            data: rows[0],
            message: 'success !',
          }
          next()
        } else {
          res.data = {
            success: false,
            data: null,
            message: 'no success !',
          }
          next()
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}

exports.getDisease = (req, res, next) => {
  return (req, res, next) => {
    var query = 'SELECT * from disease'
    try {
      database.query(query, function (err, rows, fields) {
        if (err) {
          throw new Error(err)
        }
        if (rows.length > 0) {
          res.data = {
            success: true,
            data: rows,
            message: 'success !',
          }
          next()
        } else {
          res.data = {
            success: false,
            data: null,
            message: 'no success !',
          }
          next()
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}
exports.getSymptom = (req, res, next) => {
  return (req, res, next) => {
    var query = 'SELECT * from symptom'
    try {
      database.query(query, function (err, rows, fields) {
        if (err) {
          throw new Error(err)
        }
        if (rows.length > 0) {
          res.data = {
            success: true,
            data: rows,
            message: 'success !',
          }
          next()
        } else {
          res.data = {
            success: false,
            data: null,
            message: 'no success !',
          }
          next()
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}
exports.getSymptomOfDisease = (req, res, next) => {
  return (req, res, next) => {
    var query = 'SELECT * from disease_symptom where diseaseNumber = ?'
    // console.log('req.body.diseaseNumber', req.query.diseaseNumber)
    try {
      database.query(
        query,
        [req.query.diseaseNumber],
        function (err, rows, fields) {
          if (err) {
            throw new Error(err)
          }
          if (rows.length > 0) {
            res.data = {
              success: true,
              data: rows,
              message: 'success !',
            }
            next()
          } else {
            res.data = {
              success: false,
              data: [],
              message: 'no success !',
            }
            next()
          }
        }
      )
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}
exports.setSymptomOfDisease = (req, res, next) => {
  return (req, res, next) => {
    let symptomData = req.body.symptomData
    var insertDisease =
      'INSERT INTO disease_symptom (diseaseSymptomNumber, diseaseNumber, symptomNumber)VALUES (null, ?, ?);'
    // var insertSymptom = 'SELECT * from disease_symptom where diseaseNumber = ?'
    // console.log('req.body.diseaseNumber', req.query.diseaseNumber)
    //     if (req.body.route_id != undefined) {
    console.log('req.body.symptomData', req.body.symptomData)
    console.log('req.body.disease', req.body.disease)

    for (let i = 0; i < symptomData.length; i++) {
      try {
        database.query(
          insertDisease,
          [req.body.disease, symptomData[i]],
          function (err, rows, fields) {
            if (err) {
              // res.status(200).json({ success: false, data: null, message: err });
              throw new Error(err)
            }
          }
        )
      } catch (error) {
        return res
          .status(200)
          .json({ success: false, data: null, message: error.message })
      }
    }
    res.data = {
      success: true,
      data: [],
      message: 'อัพเดทข้อมูลสำเร็จ !',
    }
    next()
  }
}

exports.getClassSymptom = (req, res, next) => {
  return (req, res, next) => {
    var query = 'SELECT * from symptom_class'
    // console.log('req.body.diseaseNumber', req.query.diseaseNumber)
    try {
      database.query(query, function (err, rows, fields) {
        if (err) {
          throw new Error(err)
        }
        if (rows.length > 0) {
          res.data = {
            success: true,
            data: rows,
            message: 'success !',
          }
          next()
        } else {
          res.data = {
            success: false,
            data: [],
            message: 'no success !',
          }
          next()
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}
exports.getFirstNode = (req, res, next) => {
  return (req, res, next) => {
    var query =
      'SELECT predict_disease_number,symptomNameTH,symptomNameEN from predict_disease left join symptom on symptom.symptomNumber = predict_disease.current_symptom where first_node = true'
    // console.log('req.body.diseaseNumber', req.query.diseaseNumber)
    try {
      database.query(
        query,
        function (err, rows, fields) {
          if (err) {
            throw new Error(err)
          }
          if (rows.length > 0) {
            res.data = {
              success: true,
              data: rows,
              message: 'success !',
            }
            next()
          } else {
            res.data = {
              success: false,
              data: [],
              message: 'no success !',
            }
            next()
          }
        }
      )
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}

exports.getPredict = (req, res, next) => {
  return (req, res, next) => {
    var query =
      'SELECT predict_disease_number,symptomNameTH,symptomNameEN,predict_disease_result from predict_disease left join symptom on symptom.symptomNumber = predict_disease.current_symptom where previous_symptom = ? and previous_status = ?'
    // console.log('req.body.diseaseNumber', req.query.diseaseNumber)
    try {
      database.query(
        query,
        [req.body.previous_symptom, req.body.previous_status],
        function (err, rows, fields) {
          if (err) {ß
            throw new Error(err)
          }
          if (rows.length > 0) {
            res.data = {
              success: true,
              data: rows,
              message: 'success !',
            }
            next()
          } else {
            res.data = {
              success: false,
              data: [],
              message: 'no success !',
            }
            next()
          }
        }
      )
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
},
exports.getPredictDisease = (req, res, next) => {
  return (req, res, next) => {
    var query =
      'SELECT * from disease where diseaseNumber = ? '
    // console.log('req.body.diseaseNumber', req.query.diseaseNumber)
    try {
      database.query(
        query,
        [req.body.disease_number],
        function (err, rows, fields) {
          if (err) {ß
            throw new Error(err)
          }
          if (rows.length > 0) {
            res.data = {
              success: true,
              data: rows,
              message: 'success !',
            }
            next()
          } else {
            res.data = {
              success: false,
              data: [],
              message: 'no success !',
            }
            next()
          }
        }
      )
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, message: error.message })
    }
  }
}
