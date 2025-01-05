import { config } from "#database/config";
import { envParseBoolean } from "#lib/env";
import FoxxieClient from "#lib/FoxxieClient";
import "#lib/setup";
import { helpUsagePostProcessor } from "#utils/constants";
import { container } from "@sapphire/pieces";
import { init } from "@sentry/node";
import i18next from "i18next";

async function main() {
  try {
    const client = new FoxxieClient();

    i18next.use(helpUsagePostProcessor);

    if (envParseBoolean("SENTRY_ENABLED", false)) {
      init({
        dsn: process.env.SENTRY_TOKEN,
        release: `Foxxie@${process.env.CLIENT_VERSION}`,
      });
    }

    await config();

    await client.login();
  } catch (err) {
    container.logger.fatal(err);
  }
}

main();
