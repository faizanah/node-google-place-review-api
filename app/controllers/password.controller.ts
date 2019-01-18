let params = { body: {}, condition: {}, pick: ['password'] }
export class PasswordController {
  constructor() {
  }
  create(req, res) {
    req.checkBody('email', 'Enter a valid email address.').isEmail().isLength({ min: 3, max: 100 })
    params.condition = { where: { email: req.body.email } }
    return req.model('User').findOne(params, (user) => {
      if (user) {
        user.sendResetPasswordInstructions()
        return res.status(200).json({ success: true, message: 'Successfully! sent password instructions.' })
      } else
        res.boom.notFound({ success: false, errors: [{ message: 'No account with that email address exists.' }] })
    })
  }
  update(req, res) {
    req.checkBody('newPassword', 'New password should be at least 6 chars long.').isLength({ min: 6 })
    req.checkBody('confirmPassword', 'Confirm password should be at least 6 chars long.').isLength({ min: 6 })
    if (req.body.newPassword === req.body.confirmPassword) {
      req.body.password = req.body.newPassword
      params.condition = { where: { id: req.user.id } }
      return req.model('User').updateOne(params)
    } else
      res.unprocessableEntity('New Password and confirm password does not match.')
  }
}
