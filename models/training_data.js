const db = require('../util/db')
const database = db.connection

database.connect()

// exports.training_data = (req, res, next) => {
//   return (req, res, next) => {
//     var query = 'SELECT * from disease'
//     var query2 = 'SELECT * from symptom'
//     var query3 =
//       'SELECT diseaseName,symptomKey FROM `disease_symptom` LEFT JOIN disease ON disease.diseaseNumber = disease_symptom.diseaseNumber LEFT JOIN symptom ON symptom.symptomNumber = disease_symptom.symptomNumber'

//     database.query(query, function (err, rows, fields) {
//       if (err) {
//         throw new Error(err)
//       }
//       if (rows.length > 0) {
//         res.disease = rows
//       } else {
//         res.disease = null
//       }
//     })
//     database.query(query2, function (err, rows, fields) {
//       if (err) {
//         throw new Error(err)
//       }
//       if (rows.length > 0) {
//         res.symptom = rows
//       } else {
//         res.symptom = null
//       }
//     })
//     database.query(query3, function (err, rows, fields) {
//       if (err) {
//         throw new Error(err)
//       }
//       if (rows.length > 0) {
//         res.disease_symptom = rows
//         next()
//       } else {
//         res.disease_symptom = null
//         next()
//       }
//     })
//   }
// }
