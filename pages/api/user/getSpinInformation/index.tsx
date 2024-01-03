import { db } from 'lib/gtm/firebase';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { createRouter } from 'next-connect';
import { getSpinInformation } from 'lib/gtm/database';
import Web3 from 'web3';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(Cors({ credentials: true, origin: true }));

router.get(async function (req, res) {
  try {
    const { address, nft } = req.query;
    const web3 = new Web3();
    return res.status(200).send({
      spinInfo: await getSpinInformation(
        web3.utils.toChecksumAddress(address as string),
        db,
        undefined,
        nft ? Number(nft as string) : undefined,
      ),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).end(error?.message ?? 'An unexpected error occurred');
  }
});

export default router.handler({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (_, res) => {
    res.status(404).end('Route not found');
  },
});
