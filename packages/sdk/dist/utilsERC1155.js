"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLinkERC1155 = exports.signLinkERC1155 = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var ethers = require('ethers'); // Should be signed by linkdrop master (sender)


var signLinkERC1155 = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(linkdropSigner, // Wallet
  ethAmount, tokenAddress, tokenId, tokenAmount, expirationTime, version, chainId, linkId, proxyAddress) {
    var messageHash, messageHashToSign, signature;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            messageHash = ethers.utils.solidityKeccak256(['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'address', 'address'], [ethAmount, tokenAddress, tokenId, Number(tokenAmount), expirationTime, version, chainId, linkId, proxyAddress]);
            messageHashToSign = ethers.utils.arrayify(messageHash);
            _context.next = 4;
            return linkdropSigner.signMessage(messageHashToSign);

          case 4:
            signature = _context.sent;
            return _context.abrupt("return", signature);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function signLinkERC1155(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref.apply(this, arguments);
  };
}(); // Generates new link


exports.signLinkERC1155 = signLinkERC1155;

var createLinkERC1155 = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(linkdropSigner, weiAmount, nftAddress, tokenId, tokenAmount, expirationTime, version, chainId, proxyAddress) {
    var linkWallet, linkKey, linkId, linkdropSignerSignature;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            linkWallet = ethers.Wallet.createRandom();
            linkKey = linkWallet.privateKey;
            linkId = linkWallet.address;
            _context2.next = 5;
            return signLinkERC1155(linkdropSigner, weiAmount, nftAddress, tokenId, tokenAmount, expirationTime, version, chainId, linkId, proxyAddress);

          case 5:
            linkdropSignerSignature = _context2.sent;
            return _context2.abrupt("return", {
              linkKey: linkKey,
              // link's ephemeral private key
              linkId: linkId,
              // address corresponding to link key
              linkdropSignerSignature: linkdropSignerSignature // signed by linkdrop verifier

            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createLinkERC1155(_x11, _x12, _x13, _x14, _x15, _x16, _x17, _x18, _x19) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createLinkERC1155 = createLinkERC1155;