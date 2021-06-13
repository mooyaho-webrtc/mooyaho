"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const _1 = __importDefault(require("."));
const util_1 = require("util");
class Client {
    constructor(address) {
        this.client = new _1.default.mooyaho.Mooyaho(address, grpc.credentials.createInsecure());
    }
    async call({ sessionId, sdp }) {
        const callAsync = util_1.promisify(this.client.call).bind(this.client);
        const res = await callAsync({
            sessionId,
            sdp,
        });
        return res.sdp;
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map