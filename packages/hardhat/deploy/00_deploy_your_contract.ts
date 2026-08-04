import { deployScript, artifacts } from "../rocketh/deploy.js";

export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;

    const fechaSiembra = Math.floor(Date.now() / 1000);

    await env.deploy("CryptoHuertaToken", {
      account: deployer,
      artifact: artifacts.CryptoHuertaToken,
      args: [
        "CryptoHuerta",
        "CHT",
        "Piura, Perú",
        "Arándanos Premium",
        1,
        fechaSiembra,
      ],
    });
  },
  { tags: ["CryptoHuertaToken"] },
);