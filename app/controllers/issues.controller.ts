let params = {body: {}, condition: {}, pick: {}}
export class IssuesController {
  constructor() {}
  list(req, res) {
    params.condition = {}
    params.condition['order'] = [ ['position', 'asc' ]]
    return req.model('ReportIssueReason').findAll(params)
  }
}
