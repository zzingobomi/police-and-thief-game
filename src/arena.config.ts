import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { LobbyRoom } from "colyseus";
import { WorldDebug } from "./debug/WorldDebug";
import { MetaRoom } from "./rooms/MetaRoom";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

export default Arena({
  getId: () => "Your Colyseus App",

  initializeGameServer: (gameServer) => {
    // Define "lobby" room
    gameServer.define("lobby", LobbyRoom);
    /**
     * Define your room handlers:
     */
    gameServer.define("my_room", MyRoom).enableRealtimeListing();
    gameServer.define("meta_room", MetaRoom).enableRealtimeListing();
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     */
    app.get("/", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use("/colyseus", monitor());

    /**
     * DebugWorld
     */
    app.use("/debug", WorldDebug());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
