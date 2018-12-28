let params = {body: {}, condition: {}, pick: {}}
export class PasswordController {
  constructor() {
  }
  create(req, res) {
    req.checkBody('email', 'Enter a valid email address.').isEmail().isLength({ min: 3, max: 100 })
    params.condition = { where: { email: req.body.email } }
    return req.model('User').findOne(params, (user) => {
      if (user) {
        user.sendResetPasswordInstructions()
        return res.status(200).json({success: true, message: 'Successfully! sent password instructions.'})
      } else
        res.boom.notFound({ success: false, errors: [{ message: 'No account with that email address exists.'  }] })
    })
  }
}
