import { Request, Response } from 'express';

import DBUtil from '../utils/db.util';
import APIUtil from '../utils/api.util';

module.exports.findPresentations = (req: Request, res: Response) => {
  const info: any = {
    key: APIUtil.key(req),
    debugInfo: {
      query: req.query,
    }
  };

  DBUtil.findPresentations(req.query)
    .then(presentations => {
      APIUtil.successResponse(info, presentations, res);
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    });
}

module.exports.createPresentation = (req: Request, res: Response) => {
  const info: any = {
    key: APIUtil.key(req),
    debugInfo: {
      body: req.body,
    }
  };

  DBUtil.createPresentation(req.body)
    .then(createdPresentation => {
      APIUtil.successResponse(info, createdPresentation, res);
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    });
}

module.exports.updatePresentation = (req: Request, res: Response) => {
  const info: any = {
    key: APIUtil.key(req),
    debugInfo: {
      _id: req.params._id,
      body: req.body,
    }
  };

  DBUtil.updatePresentation(req.params._id, req.body)
    .then(updatedPresentation => {
      APIUtil.successResponse(info, updatedPresentation, res);
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    });
}

module.exports.deletePresentation = (req: Request, res: Response) => {
  const info: any = {
    key: APIUtil.key(req),
    debugInfo: {
      _id: req.params._id,
      body: req.body,
    }
  };

  DBUtil.deletePresentation(req.params._id, req.body)
    .then(() => {
      APIUtil.successResponse(info, true, res);
      // Cannot use post('remove') since I cannot pass req.body.cancelNote to the middleware
    })
    .catch(err => {
      APIUtil.errorResponse(info, err.message, {}, res);
    });
  // APIUtil.successResponse(info, true, res);
}