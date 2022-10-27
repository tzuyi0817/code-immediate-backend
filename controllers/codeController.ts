import type { Request, Response } from 'express';
import { Code } from '../models/code';

const codeController = {
  getCodeList(req: Request, res: Response) {
    const { page = 1 } = req.query;
    const limit = 6;
    const skip = limit * (+page - 1);

    Code
      .find({ userId: req.user?.id }, null, { skip, limit })
      .exec((error, codeList) => {
        if (error)
          return res.status(400).json({ status: 'error', message: error });
        
        const data = codeList.map(({ _id, HTML, CSS, JS, VUE, codeTemplate, importMap }) => {
          return { id: _id, HTML, CSS, JS, VUE, codeTemplate, importMap };
        });

        return res.json({
          status: 'success',
          message: 'success',
          resultMap: {
            codeList: data,
            page,
            totalPage: Math.ceil(codeList.length / limit),
            total: codeList.length,
          }
        });
      });
  },
  async getCode(req: Request, res: Response) {
    const code = await Code
      .findOne({ id: req.params.id, userId: req.user?.id })
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));

    return res.json({ status: 'success', message: 'success', resultMap: { code } });
  },
  postCode(req: Request, res: Response) {
    const codeContent = JSON.parse(req.body.codeContent);
    const code = new Code({ ...codeContent, userId: req.user?.id });

    code
      .save()
      .then(() => res.json({ status: 'success', message: 'saved successfully' }))
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));
  },
};

export default codeController;
