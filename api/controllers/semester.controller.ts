import { Request, Response } from 'express';

import DBUtil from '../utils/db.util';
import APIUtil, { APIInfo } from '../utils/api.util';

module.exports.findSemesters = (req: Request, res: Response) => {
  const info: APIInfo = {
    key: APIUtil.key(req),
    debugInfo: {}
  };

  DBUtil.findSemesters()
    .then(semesters => {
      APIUtil.successResponse(info, semesters, res);
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    });
}

module.exports.createSemester = (req: Request, res: Response) => {
  const info: APIInfo = {
    key: APIUtil.key(req),
    debugInfo: {
      userId: req.user._id,
      body: req.body,
    }
  }

  DBUtil.createSemester(req.body)
    .then(createdSemester => {
      APIUtil.successResponse(info, createdSemester, res);
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    })
}

module.exports.updateSemester = (req: Request, res: Response) => {
  const info: APIInfo = {
    key: APIUtil.key(req),
    debugInfo: {
      userId: req.user._id,
      _id: req.params._id,
      body: req.body,
    }
  }

  DBUtil.updateSemesterById(req.params._id, req.body)
    .then(updatedSemester => {
      APIUtil.successResponse(info, updatedSemester, res);
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    })
}