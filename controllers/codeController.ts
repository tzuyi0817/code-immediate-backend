import type { Request, Response } from 'express';
import { Code } from '../models/code';

const codeController = {
  getCodeList(req: Request, res: Response) {
    const { page = 1 } = req.query;
    const limit = 6;
    const skip = limit * (+page - 1);

    Code
      .find({ userId: req.user?.id }, null, { skip, limit })
      .exec(async (error, codeList) => {
        if (error)
          return res.status(400).json({ status: 'error', message: error });
        
        const data = codeList.map(({ _id, HTML, CSS, JS, VUE, codeTemplate, title }) => {
          return { id: _id, title, HTML, CSS, JS, VUE, codeTemplate };
        });
        const totalSize = await Code.countDocuments({ userId: req.user?.id });

        return res.json({
          status: 'success',
          message: 'success',
          resultMap: {
            codeList: data,
            page,
            totalPage: Math.ceil(totalSize / limit),
            totalSize,
          }
        });
      });
  },
  async getCode(req: Request, res: Response) {
    const code = await Code
      .findOne({ _id: req.params.id, userId: req.user?.id })
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));

    return res.json({ status: 'success', message: 'success', resultMap: { code } });
  },
  postCode(req: Request, res: Response) {
    const codeContent = JSON.parse(req.body.codeContent);
    const code = new Code({ ...codeContent, userId: req.user?.id });

    code
      .save()
      .then(code => {
        return res.json({
          status: 'success',
          message: 'saved successfully',
          resultMap: { code },
        })
      })
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));
  },
  async updateCode(req: Request, res: Response) {
    const code = JSON.parse(req.body.codeContent);

    await Code
      .findOneAndUpdate({ _id: req.params.id, userId: req.user?.id }, code, { upsert: true })
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));
    
    return res.json({ status: 'success', message: 'updated successfully' });
  },
  async deleteCode(req: Request, res: Response) {
    await Code
      .findOneAndDelete({ _id: req.params.id, userId: req.user?.id })
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));
    
    return res.json({ status: 'success', message: 'deleted successfully' });
  }
};

export default codeController;
