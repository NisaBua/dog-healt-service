const db = require('../util/db')
const jwt = require('jsonwebtoken')
const config = require('../util/config.json')
const bcrypt = require('bcrypt')
const database = db.connection
const saltRounds = 10

exports.login = (req, res, next) => {
  return (req, res, next) => {
    var query = 'SELECT username,password from user where username = ?'
    const user = {
      username: req.body.username,
    }
    if (
      req.body.username === undefined ||
      req.body.password === undefined ||
      req.body.username === '' ||
      req.body.password === ''
    ) {
      return res
        .status(500)
        .json({ success: false, data: null, message: 'กรอกข้อมูลไม่ครบ' })
    }
    try {
      database.query(query, [req.body.username], function (err, rows, fields) {
        if (err) {
          throw new Error(err)
        }
        if (rows.length > 0) {
          if (bcrypt.compareSync(req.body.password, rows[0].password)) {
            const token = jwt.sign(user, config.secret, {
              expiresIn: config.tokenLife,
            })

            let data = {
              token: token,
              expire:
                Math.floor(new Date().getTime() / 1000) + config.tokenLife,
            }

            res.data = {
              success: true,
              data: data,
              message: 'success !',
            }
            next()
          } else {
            res.data = {
              success: false,
              data: null,
              message: 'password not math!',
            }
            next()
          }
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

exports.setPassword = (req, res, next) => {
  return async (req, res, next) => {
    const hash = await bcrypt.hashSync(req.body.password, saltRounds)
    var insertDisease =
    'UPDATE user SET password = ? where username = ?'
    try {
      database.query(
        insertDisease,
        [hash ,req.body.username],
        function (err, rows, fields) {
          if (err) {
            // res.status(200).json({ success: false, data: null, message: err });
            throw new Error(err)
          }
          res.data = {
            success: true,
            data: 'success',
            message: 'เปลี่ยนรหัสผ่านสำเร็จ !',
          }
          next()
        }
      )
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, data: null, message: error.message })
    }

  }
}

exports.requestResetPassword = (req, res, next) => {
  return (req, res, next) => {
    var query =
      'SELECT username,nameTitle,firstName,lastName from user where username = ? and birthDate = ?'
    try {
      database.query(
        query,
        [req.body.username,req.body.birthDate],
        function (err, rows, fields) {
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
              data: [],
              message: 'ไม่พบผู้ใช้งาน หรือ กรอกข้อมูลไม่ถูกต้อง !',
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

exports.getProfile = (req, res, next) => {
  return (req, res, next) => {
    var query =
      'SELECT nameTitle,firstName,lastName from user where username = ?'
    try {
      console.log('req.decoded', req.decoded)
      database.query(
        query,
        [req.decoded.username],
        function (err, rows, fields) {
          if (err) {
            ß
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
