var _ = require('lodash')
const db = require('../util/db')
const database = db.connection

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
    var query = 'SELECT * from current_symptom'
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
        query, [req.query.diseaseNumber],
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
          insertDisease, [req.body.disease, symptomData[i]],
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
      'SELECT predict_disease_number,symptomNameTH,symptomNameEN,question_EN,question_TH,detail_TH,detail_EN  from predict_disease left join current_symptom on current_symptom.symptomNumber = predict_disease.current_symptom where first_node = true'
    try {
      database.query(query, function (err, rows) {
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
};
(exports.getNextNode = (req, res, next) => {
  return (req, res, next) => {
    var query =
      'SELECT predict_disease_number,symptomNameTH,symptomNameEN,predict_disease_result,question_EN,question_TH,detail_TH,detail_EN from predict_disease left join current_symptom on current_symptom.symptomNumber = predict_disease.current_symptom where previous_predict = ? and previous_status = ?'
    try {
      database.query(
        query, [req.body.previous_predict, req.body.previous_status],
        function (err, rows) {
          if (err) {
            ß
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
}),
  (exports.getPredictDisease = (req, res, next) => {
    return (req, res, next) => {
      var query = 'SELECT * from disease where diseaseNumber = ? '
      try {
        database.query(
          query, [req.body.disease_number],
          function (err, rows) {
            if (err) {
              ß
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
  }),
  (exports.updateSymptom = (req, res, next) => {
    return (req, res, next) => {
      console.log(req.body)
      var insertDisease =
        'UPDATE current_symptom SET question_TH = ? , question_EN =  ? , symptomNameEN = ? , symptomNameTH = ?  , detail_EN = ? , detail_TH = ?  WHERE symptomNumber = ?'
      try {
        database.query(
          insertDisease, [
          req.body.question_TH,
          req.body.question_EN,
          req.body.symptomNameEN,
          req.body.symptomNameTH,
          req.body.detailEN,
          req.body.detailTH,
          req.body.symptomNumber
        ],
          function (err, rows, fields) {
            if (err) {
              // res.status(200).json({ success: false, data: null, message: err });
              throw new Error(err)
            }
            res.data = {
              success: true,
              data: rows,
              message: 'อัพเดทข้อมูลสำเร็จ !',
            }
            next()
          }
        )
      } catch (error) {
        throw new Error(err)
        return res
          .status(200)
          .json({ success: false, data: null, message: error.message })
      }
    }
  }),
  (exports.updateDisease = (req, res, next) => {
    return (req, res, next) => {
      var insertDisease =
        'UPDATE disease SET diseaseEN = ? , diseaseTH =  ? , treatmentGuidelinesEN = ? , treatmentGuidelinesTH = ?, symptomDetailEN = ?,symptomDetailTH = ? WHERE diseaseNumber = ?'
      try {
        database.query(
          insertDisease, [
          req.body.diseaseEN,
          req.body.diseaseTH,
          req.body.treatmentGuidelinesEN,
          req.body.treatmentGuidelinesTH,
          req.body.symptomDetailEN,
          req.body.symptomDetailTH,
          req.body.diseaseNumber,
        ],
          function (err, rows, fields) {
            if (err) {
              // res.status(200).json({ success: false, data: null, message: err });
              throw new Error(err)
            }
            res.data = {
              success: true,
              data: rows,
              message: 'อัพเดทข้อมูลสำเร็จ !',
            }
            next()
          }
        )
      } catch (error) {
        throw new Error(err)
        return res
          .status(200)
          .json({ success: false, data: null, message: error.message })
      }
    }
  })