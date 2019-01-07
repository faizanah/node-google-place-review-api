export function initRoutes(app, router) {
  router.get('/', (req, res) => {
    res.render('index', { title: 'IMFO' })
  })
  router.get('/password/reset/:token', (req, res) => {
    let params = {condition: { where: {resetToken: req.params.token} }}
    req.model('User').findOne(params, (user) => {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.')
        return res.redirect('/forgot')
      }
      res.render('reset', { title: 'IMFO - Password Reset' })
    })
  })
  router.post('/password/reset/:token', (req, res) => {
    let params = {condition: { where: {resetToken: req.params.token} }}
    req.model('User').findOne(params, (user) => {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.')
        return res.redirect('back')
      }
      user.password = req.body.password
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined

      user.save().then(function(err) {
        req.flash('success', 'Success! Your password has been changed.')
        res.redirect('/')
      })
    })
  })
  router.get('/forgot', function(req, res) {
    res.render('forgot', {
    })
  })
  router.post('/forgot', function(req, res, next) {
    let params = {condition: { where: { email: req.body.email } } }
    return req.model('User').findOne(params, (user) => {
      if (user) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.')
        user.sendResetPasswordInstructions()
        return res.redirect('/forgot')
      } else {
        req.flash('error', 'No account with that email address exists.')
        return res.redirect('/forgot')
      }
    })
  })
  return router
}
