import { expect } from 'chai';
import { spy } from 'sinon';
import Lisk from 'shift-js';
import actionTypes from '../constants/actions';
import { activePeerSet, activePeerUpdate } from './peers';


describe('actions: peers', () => {
  const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';

  describe('activePeerUpdate', () => {
    it('should create an action to update the active peer', () => {
      const data = {
        online: true,
      };

      const expectedAction = {
        data,
        type: actionTypes.activePeerUpdate,
      };
      expect(activePeerUpdate(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('activePeerSet', () => {
    it('creates active peer config', () => {
      const data = {
        passphrase,
        network: {
          name: 'Custom Node',
          custom: true,
          address: 'http://localhost:4000',
          testnet: true,
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      };
      const actionSpy = spy(Lisk, 'api');
      activePeerSet(data);
      expect(actionSpy).to.have.been.calledWith(data.network);
      Lisk.api.restore();
    });

    it('dispatch activePeerSet action also when address http missing', () => {
      const data = {
        passphrase,
        network: {
          address: 'localhost:8000',
        },
      };
      const actionSpy = spy(Lisk, 'api');
      activePeerSet(data);
      expect(actionSpy).to.have.been.calledWith();
      Lisk.api.restore();
    });

    it('dispatch activePeerSet action even if network is undefined', () => {
      const data = { passphrase };
      const actionSpy = spy(Lisk, 'api');
      activePeerSet(data);
      expect(actionSpy).to.have.been.calledWith();
      Lisk.api.restore();
    });

    it('dispatch activePeerSet action even if network.address is undefined', () => {
      const data = { passphrase, network: {} };
      const actionSpy = spy(Lisk, 'api');
      activePeerSet(data);
      expect(actionSpy).to.have.been.calledWith();
      Lisk.api.restore();
    });

    it('should set to testnet if not defined in config but port is 9998', () => {
      const network9998 = {
        address: 'http://127.0.0.1:9998',
        nethash: '0daee950841005a3f56f6588b4b084695f0d74aaa38b21edab73446064638552',
      };
      const network4000 = {
        address: 'http://127.0.0.1:4000',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };
      let actionObj = activePeerSet({ passphrase, network: network9998 });
      expect(actionObj.data.activePeer.testnet).to.be.equal(true);
      actionObj = activePeerSet({ passphrase, network: network4000 });
      expect(actionObj.data.activePeer.testnet).to.be.equal(false);
    });
  });
});
