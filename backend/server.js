import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const app = express();
const PORT = process.env.PORT || 8000;

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Seu nome de usuário
  database: "mydb",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados");
  }
});

// Middleware
app.use(cors()); // Adicione esta linha
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Função para obter o ID da equipe com base no nome da equipe
const getTeamID = async (TeamID) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT TeamID FROM Equipas WHERE TeamID = ?;
    `;

    connection.query(query, [TeamID], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const [firstResult] = results;
        if (firstResult) {
          resolve(firstResult.TeamID);
        } else {
          reject(new Error("Equipe não encontrada"));
        }
      }
    });
  });
};

app.post("/adddata", async (req, res) => {
  try {
    const playerData = req.body;
    console.log(
      "Dados recebidos da API para inserção no banco de dados:",
      playerData
    );

    // Obter o ID da equipe com base no nome da equipe
    const TeamID = await getTeamID(playerData.TeamID);

    const query = `
    INSERT INTO Jogadores (
      id_jogadores,
      Equipas_id_Equipas,
      PlayerID,
      Status,
      TeamID,
      Team,
      Jersey,
      PositionCategory,
      Position,
      FirstName,
      LastName,
      BirthDate,
      BirthCity,
      BirthState,
      BirthCountry,
      GlobalTeamID,
      Height,
      Weight
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      playerData.PlayerID, // id_jogadores
      TeamID,
      playerData.PlayerID, // PlayerID
      playerData.Status,
      playerData.TeamID,
      playerData.Team,
      playerData.Jersey,
      playerData.PositionCategory,
      playerData.Position,
      playerData.FirstName,
      playerData.LastName,
      playerData.BirthDate,
      playerData.BirthCity,
      playerData.BirthState,
      playerData.BirthCountry,
      playerData.GlobalTeamID,
      playerData.Height,
      playerData.Weight,
    ];

    await connection.query(query, values);
    console.log("Dados de jogador adicionados com sucesso ao banco de dados");
    res.status(200).send("Dados de jogador adicionados com sucesso");
  } catch (error) {
    console.error(
      "Erro ao adicionar dados de jogador ao banco de dados:",
      error
    );
    res.status(500).send("Erro interno do servidor");
  }
});

app.post("/adddata-all-players", async (req, res) => {
  try {
    const playersData = req.body; // Lista de jogadores da equipe selecionada

    if (!playersData.length) {
      throw new Error("Nenhum jogador selecionado");
    }

    // Preparar a consulta SQL para inserção de múltiplos jogadores
    const query = `
      INSERT INTO Jogadores (
        id_jogadores,
        Equipas_id_Equipas,
        PlayerID,
        Status,
        TeamID,
        Team,
        Jersey,
        PositionCategory,
        Position,
        FirstName,
        LastName,
        BirthDate,
        BirthCity,
        BirthState,
        BirthCountry,
        GlobalTeamID,
        Height,
        Weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // Executar a consulta SQL para cada jogador
    for (const player of playersData) {
      const TeamID = player.TeamID;

      const values = [
        player.PlayerID, // id_jogadores
        TeamID,
        player.PlayerID, // PlayerID
        player.Status,
        player.TeamID,
        player.Team,
        player.Jersey,
        player.PositionCategory,
        player.Position,
        player.FirstName,
        player.LastName,
        player.BirthDate,
        player.BirthCity,
        player.BirthState,
        player.BirthCountry,
        player.GlobalTeamID,
        player.Height,
        player.Weight,
      ];

      await connection.query(query, values);
    }

    console.log(
      "Jogadores da equipe selecionada adicionados com sucesso ao banco de dados"
    );
    res.status(200).send("Jogadores adicionados com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar jogadores da equipe selecionada:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/api/players", async (req, res) => {
  try {
    const query = `
      SELECT 
        jogadores.Equipas_id_Equipas,
        jogadores.PlayerID,
        jogadores.FirstName,
        jogadores.LastName,
        jogadores.Position,
        jogadores.Status,
        jogadores.TeamID,
        jogadores.Team,
        CONCAT(Equipas.City, ' ', Equipas.Name) AS TeamName,
        jogadores.Jersey,
        jogadores.PositionCategory,
        jogadores.Position,
        jogadores.BirthDate,
        jogadores.BirthCity,
        jogadores.BirthState,
        jogadores.BirthCountry,
        jogadores.GlobalTeamID,
        jogadores.Height,
        jogadores.Weight
      FROM 
        jogadores
      INNER JOIN Equipas ON jogadores.Equipas_id_Equipas = Equipas.id_Equipas;
    `;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao obter dados dos jogadores:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error("Erro ao obter dados dos jogadores:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualiza um jogador existente
app.put("/api/players/update/:id", (req, res) => {
  const playerId = req.params.id;
  const updatedData = req.body;

  const updateQuery = `
    UPDATE Jogadores
    SET 
      Equipas_id_Equipas = ?,
      PlayerID = ?,
      Status = ?,
      TeamID = ?,
      Team = ?,
      Jersey = ?,
      PositionCategory = ?,
      Position = ?,
      FirstName = ?,
      LastName = ?,
      BirthDate = ?,
      BirthCity = ?,
      BirthState = ?,
      BirthCountry = ?,
      GlobalTeamID = ?,
      Height = ?,
      Weight = ?
    WHERE PlayerID = ?;
  `;

  const values = [
    updatedData.Equipas_id_Equipas,
    updatedData.PlayerID,
    updatedData.Status,
    updatedData.TeamID,
    updatedData.Team,
    updatedData.Jersey,
    updatedData.PositionCategory,
    updatedData.Position,
    updatedData.FirstName,
    updatedData.LastName,
    updatedData.BirthDate,
    updatedData.BirthCity,
    updatedData.BirthState,
    updatedData.BirthCountry,
    updatedData.GlobalTeamID,
    updatedData.Height,
    updatedData.Weight,
    playerId,
  ];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar dados do jogador:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      console.log("Dados do jogador atualizados com sucesso");
      res.status(200).send("Dados do jogador atualizados com sucesso");
    }
  });
});


// Exclui um jogador existente
app.put("/api/equipas/delete/:id", (req, res) => {
  const equipeId = req.params.id;
  const updatedData = req.body;

  const updateQuery = `
    UPDATE Equipas
    SET 
      Status = ?
    WHERE Equipas_id = ?;
  `;

  const values = [updatedData.Status, equipeId];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Erro ao deletar os dados do jogador:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      console.log("Dados do jogador deletados com sucesso");
      res.status(200).send("Dados do jogador deletados com sucesso");
    }
  });
});

// Exclui um jogador existente
app.put("/api/players/delete/:id", (req, res) => {
  const playerId = req.params.id;
  const updatedData = req.body;

  const updateQuery = `
    UPDATE Jogadores
    SET 
      Status = ?
    WHERE PlayerID = ?;
  `;

  const values = [updatedData.Status, playerId];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Erro ao deletar os dados do jogador:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      console.log("Dados do jogador deletados com sucesso");
      res.status(200).send("Dados do jogador deletados com sucesso");
    }
  });
});
// Reativa um jogador deletado
app.put("/api/players/reactivate/:id", (req, res) => {
  const playerId = req.params.id;
  const updatedData = req.body;

  const updateQuery = `
    UPDATE Jogadores
    SET 
      Status = ?
    WHERE PlayerID = ?;
  `;

  const values = [updatedData.Status, playerId];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Erro ao reativar os dados do jogador:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      console.log("Dados do jogador reativados com sucesso");
      res.status(200).send("Dados do jogador reativados com sucesso");
    }
  });
});

// Função para obter IDs da Conferencia, Divisoes e Liga com base nos nomes
const getConferenciaDivisoesLigaIds = async (conferenceName, divisionName) => {
  console.log("Nomes fornecidos pela API:", conferenceName, divisionName);
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.id_Conferencia, d.id_Divisoes, l.id_Liga
      FROM Conferencia c
      JOIN Divisoes d ON c.id_Conferencia = d.Conferencia_id_Conferencia
      JOIN Liga l ON c.Liga_id_Liga = l.id_Liga
      WHERE c.Descricao = ? AND d.Descricao = ?;
    `;

    connection.query(query, [conferenceName, divisionName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const [firstResult] = results;
        if (firstResult) {
          resolve({
            id_Conferencia: firstResult.id_Conferencia,
            id_Divisoes: firstResult.id_Divisoes,
            id_Liga: firstResult.id_Liga,
          });
        } else {
          reject(new Error("Conferencia ou Divisoes não encontradas"));
        }
      }
    });
  });
};

app.post("/adddata2", async (req, res) => {
  try {
    const teamData = req.body;

    // Obter IDs da Conferencia, Divisoes e Liga
    const { id_Conferencia, id_Divisoes, id_Liga } =
      await getConferenciaDivisoesLigaIds(
        teamData.Conference,
        teamData.Division,
        teamData.League
      );

    // Usar o StadiumID fornecido pela API
    const estadioId = teamData.StadiumID;

    const query = `
  INSERT INTO Equipas (
    id_Equipas,
    Divisoes_id_Divisoes,
    Divisoes_Conferencia_id_Conferencia,
    Divisoes_Conferencia_Liga_id_Liga,
    TeamID,
    TeamKey,
    Active,
    City,
    Name,
    Estadios_id_Estadios,
    Conference,
    Division,
    PrimaryColor,
    SecondaryColor,
    TertiaryColor,
    QuaternaryColor,
    WikipediaLogoUrl,
    WikipediaWordMarkUrl,
    GlobalTeamID,
    NbaDotComTeamID,
    HeadCoach,
    StadiumID,
    LeagueID
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      teamData.TeamID,
      id_Divisoes,
      id_Conferencia,
      id_Liga,
      teamData.TeamID,
      teamData.Key,
      teamData.Active,
      teamData.City,
      teamData.Name,
      estadioId,
      teamData.Conference,
      teamData.Division,
      teamData.PrimaryColor,
      teamData.SecondaryColor,
      teamData.TertiaryColor,
      teamData.QuaternaryColor,
      teamData.WikipediaLogoUrl,
      teamData.WikipediaWordMarkUrl,
      teamData.GlobalTeamID,
      teamData.NbaDotComTeamID,
      teamData.HeadCoach,
      teamData.StadiumID, // Inclua o StadiumID aqui
      teamData.LeagueID,
    ];

    await connection.query(query, values);
    console.log("Dados adicionados com sucesso ao banco de dados");
    res.status(200).send("Dados adicionados com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar dados ao banco de dados:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/api/equipas", (req, res) => {
  const query = `
    SELECT 
      Equipas.id_Equipas,
      Equipas.Divisoes_id_Divisoes,
      Equipas.Divisoes_Conferencia_id_Conferencia,
      Equipas.Divisoes_Conferencia_Liga_id_Liga,
      Equipas.TeamID,
      Equipas.TeamKey,
      Equipas.Active,
      Equipas.City,
      CONCAT(Equipas.City, ' ', Equipas.Name) AS TeamName,
      Equipas.Estadios_id_Estadios,
      Equipas.Conference,
      Equipas.Division,
      Equipas.PrimaryColor,
      Equipas.SecondaryColor,
      Equipas.TertiaryColor,
      Equipas.QuaternaryColor,
      Equipas.WikipediaLogoUrl,
      Equipas.WikipediaWordMarkUrl,
      Equipas.GlobalTeamID,
      Equipas.NbaDotComTeamID,
      Equipas.HeadCoach,
      Equipas.StadiumID,
      Equipas.LeagueID
    FROM 
      Equipas
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});

// Rota para obter detalhes de um estádio específico
app.get("/api/estadios/:id", (req, res) => {
  const stadiumId = req.params.id;

  const query = `
    SELECT
    Estadios.id_Estadios,
    Estadios.StadiumID,
    Estadios.Active,
    Estadios.Name,
    Estadios.Address,
    Estadios.City,
    Estadios.State,
    Estadios.Zip,
    Estadios.Country,
    Estadios.Capacity,
    Estadios.GeoLat,
    Estadios.GeoLong
    FROM
      Estadios
    WHERE
    Estadios.id_Estadios = ?
  `;

  connection.query(query, [stadiumId], (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Estádio não encontrado" });
    } else {
      res.json(results[0]); // Retorna apenas o primeiro resultado (deve haver apenas um)
    }
  });
});
app.get("/api/classificacao", (req, res) => {
  const query = `
    SELECT 
    Classificacao.Season, 
    Classificacao.SeasonType, 
    Classificacao.Equipas_id_Equipas, 
    Classificacao.Equipas_Divisoes_id_Divisoes, 
    Classificacao.Equipas_Divisoes_Conferencia_id_Conferencia, 
    Classificacao.Equipas_Divisoes_Conferencia_Liga_id_Liga, 
    Classificacao.Equipas_Estadios_id_Estadios, 
    Classificacao.TeamID, 
    Classificacao.TeamKey,
    Classificacao.City, 
    Classificacao.Name, 
    Classificacao.Conference, 
    Classificacao.Division, 
    Classificacao.Wins, 
    Classificacao.Losses, 
    Classificacao.Percentage, 
    Classificacao.ConferenceWins, 
    Classificacao.ConferenceLosses, 
    Classificacao.DivisionWins, 
    Classificacao.DivisionLosses, 
    Classificacao.HomeWins, 
    Classificacao.HomeLosses, 
    Classificacao.AwayWins, 
    Classificacao.AwayLosses, 
    Classificacao.LastTenWins, 
    Classificacao.LastTenLosses, 
    Classificacao.PointsPerGameFor,
    Classificacao.PointsPerGameAgainst, 
    Classificacao.Streak, 
    Classificacao.GamesBack, 
    Classificacao.StreakDescription, 
    Classificacao.GlobalTeamID, 
    Classificacao.ConferenceRank, 
    Classificacao.DivisionRank, 
    Classificacao.SeasonType_id_SeasonType
    FROM 
      Classificacao
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});
app.post("/teste", async (req, res) => {
  const resend = new Resend("re_WVgMm9nA_FvzVt2aFPQT4UL7HQ9uYisKB");
  await resend.emails.send({
    from: "Admin <admin@pap-miguel.online>",
    to: ["aluno221014@epad.edu.pt"],
    subject: "hello world",
    text: "it works!",
  });

  console.log("Recebido");
});
// Rota para adicionar dados à tabela Classificacao
app.get("/api/classificacao/:season", (req, res) => {
  const season = req.params.season; // Obter o ano da temporada da requisição

  const query = `
    SELECT 
    Classificacao.Season, 
    Classificacao.SeasonType, 
    Classificacao.Equipas_id_Equipas, 
    Classificacao.Equipas_Divisoes_id_Divisoes, 
    Classificacao.Equipas_Divisoes_Conferencia_id_Conferencia, 
    Classificacao.Equipas_Divisoes_Conferencia_Liga_id_Liga, 
    Classificacao.Equipas_Estadios_id_Estadios, 
    Classificacao.TeamID, 
    Classificacao.TeamKey,
    Classificacao.City, 
    Classificacao.Name, 
    Classificacao.Conference, 
    Classificacao.Division, 
    Classificacao.Wins, 
    Classificacao.Losses, 
    Classificacao.Percentage, 
    Classificacao.ConferenceWins, 
    Classificacao.ConferenceLosses, 
    Classificacao.DivisionWins, 
    Classificacao.DivisionLosses, 
    Classificacao.HomeWins, 
    Classificacao.HomeLosses, 
    Classificacao.AwayWins, 
    Classificacao.AwayLosses, 
    Classificacao.LastTenWins, 
    Classificacao.LastTenLosses, 
    Classificacao.PointsPerGameFor,
    Classificacao.PointsPerGameAgainst, 
    Classificacao.Streak, 
    Classificacao.GamesBack, 
    Classificacao.StreakDescription, 
    Classificacao.GlobalTeamID, 
    Classificacao.ConferenceRank, 
    Classificacao.DivisionRank, 
    Classificacao.SeasonType_id_SeasonType
    FROM 
      Classificacao
    WHERE
      Classificacao.Season = ?
  `;

  connection.query(query, [season], (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/add/classificacao/all", (req, res) => {
  const standings = req.body.standings;

  const promises = standings.map((data) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Classificacao(
        Season, 
        SeasonType, 
        Equipas_id_Equipas, 
        Equipas_Divisoes_id_Divisoes, 
        Equipas_Divisoes_Conferencia_id_Conferencia, 
        Equipas_Divisoes_Conferencia_Liga_id_Liga, 
        Equipas_Estadios_id_Estadios, 
        TeamID, 
        TeamKey,
        City, 
        Name, 
        Conference, 
        Division, 
        Wins, 
        Losses, 
        Percentage, 
        ConferenceWins, 
        ConferenceLosses, 
        DivisionWins, 
        DivisionLosses, 
        HomeWins, 
        HomeLosses, 
        AwayWins, 
        AwayLosses, 
        LastTenWins, 
        LastTenLosses, 
        PointsPerGameFor,
        PointsPerGameAgainst, 
        Streak, GamesBack, 
        StreakDescription, 
        GlobalTeamID, 
        ConferenceRank, 
        DivisionRank, 
        SeasonType_id_SeasonType) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const seasonTypeValue = data.SeasonType; // Obter valor de SeasonType

      connection.query(
        query,
        [
          data.Season,
          seasonTypeValue, // Usar o valor de SeasonType para SeasonType_id_SeasonType
          data.id_Equipas,
          data.Divisoes_id_Divisoes,
          data.Divisoes_Conferencia_id_Conferencia,
          data.Divisoes_Conferencia_Liga_id_Liga,
          data.Estadios_id_Estadios,
          data.TeamID,
          data.Key,
          data.City,
          data.Name,
          data.Conference,
          data.Division,
          data.Wins,
          data.Losses,
          data.Percentage,
          data.ConferenceWins,
          data.ConferenceLosses,
          data.DivisionWins,
          data.DivisionLosses,
          data.HomeWins,
          data.HomeLosses,
          data.AwayWins,
          data.AwayLosses,
          data.LastTenWins,
          data.LastTenLosses,
          data.PointsPerGameFor,
          data.PointsPerGameAgainst,
          data.Streak,
          data.GamesBack,
          data.StreakDescription,
          data.GlobalTeamID,
          data.ConferenceRank,
          data.DivisionRank,
          seasonTypeValue, // Usar o valor de SeasonType para SeasonType_id_SeasonType
        ],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  });

  Promise.all(promises)
    .then(() => {
      res.status(201).json({
        message: "Dados adicionados com sucesso à tabela Classificacao",
      });
    })
    .catch((error) => {
      console.error("Erro ao adicionar dados à tabela Classificacao:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
});

// Rota para obter todos os estádios
app.get("/api/estadios", (req, res) => {
  const query = `
    SELECT
    Estadios.id_Estadios,
    Estadios.StadiumID,
    Estadios.Active,
    Estadios.Name,
    Estadios.Address,
    Estadios.City,
    Estadios.State,
    Estadios.Zip,
    Estadios.Country,
    Estadios.Capacity,
    Estadios.GeoLat,
    Estadios.GeoLong
    FROM
      Estadios
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});

// Adicione uma nova rota para obter os detalhes de uma equipe por ID
app.get("/api/equipas/:id", (req, res) => {
  const equipeId = req.params.id;

  const query = `
    SELECT 
      Equipas.id_Equipas,
      Equipas.Divisoes_id_Divisoes,
      Equipas.Divisoes_Conferencia_id_Conferencia,
      Equipas.Divisoes_Conferencia_Liga_id_Liga,
      Equipas.TeamID,
      Equipas.TeamKey,
      Equipas.Active,
      Equipas.City,
      CONCAT(Equipas.City, ' ', Equipas.Name) AS TeamName,
      Equipas.Estadios_id_Estadios,
      Equipas.Conference,
      Equipas.Division,
      Equipas.PrimaryColor,
      Equipas.SecondaryColor,
      Equipas.TertiaryColor,
      Equipas.QuaternaryColor,
      Equipas.WikipediaLogoUrl,
      Equipas.WikipediaWordMarkUrl,
      Equipas.GlobalTeamID,
      Equipas.NbaDotComTeamID,
      Equipas.HeadCoach,
      Equipas.StadiumID,
      Equipas.LeagueID
    FROM 
      Equipas
    WHERE
      Equipas.id_Equipas = ?
  `;

  connection.query(query, [equipeId], (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Equipe não encontrada" });
    } else {
      res.json(results[0]); // Retorna apenas o primeiro resultado (deve haver apenas um)
    }
  });
});

app.put("/updateData2/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (isNaN(id)) {
    return res.status(400).send("TeamID inválido");
  }

  const updateQuery = `
    UPDATE Teams
    SET 
      TeamName = ?,
      City = ?, 
    WHERE TeamID = ?;
  `;

  const values = [updatedData.TeamName, updatedData.City, id];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar dados:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      console.log("Dados atualizados com sucesso no banco de dados");
      res.status(200).send("Dados atualizados com sucesso");
    }
  });
});

app.post("/adddata-stadium", async (req, res) => {
  try {
    const stadiumData = req.body;

    const query = `
      INSERT INTO Estadios (id_Estadios, StadiumID, Active, Name, Address, City, State, Zip, Country, Capacity, GeoLat, GeoLong)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      stadiumData.StadiumID,
      stadiumData.StadiumID,
      stadiumData.Active,
      stadiumData.Name,
      stadiumData.Address,
      stadiumData.City,
      stadiumData.State,
      stadiumData.Zip,
      stadiumData.Country,
      stadiumData.Capacity,
      stadiumData.GeoLat,
      stadiumData.GeoLong,
    ];

    await connection.query(query, values);
    console.log("Dados do estádio adicionados com sucesso ao banco de dados");
    res.status(200).send("Dados do estádio adicionados com sucesso");
  } catch (error) {
    console.error(
      "Erro ao adicionar dados do estádio ao banco de dados:",
      error
    );
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/api/games/:season/:team?", (req, res) => {
  const { season, team } = req.params;

  let query = `
    SELECT *
    FROM Jogos
    WHERE Season = ?
  `;

  const params = [season];

  if (team) {
    query += ` AND (HomeTeam = ? OR AwayTeam = ?)`;
    params.push(team, team);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/game/:day", (req, res) => {
  const { day } = req.params;

  let query = `
    SELECT *
    FROM Jogos
    WHERE Day = ?
  `;

  const params = [day];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});


app.get("/api/games", (req, res) => {
  const query = `
    SELECT
    *
    FROM
      Jogos
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao obter dados do banco de dados:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(results);
    }
  });
});

app.post("/addgame", async (req, res) => {
  try {
    const game = req.body;
    const query = `
    INSERT INTO Jogos (
      id_jogos,
      Estadios_id_Estadios,
      SeasonType_id_SeasonType,
      GameID,
      Season,
      SeasonType,
      Status,
      Day,
      DateTime,
      AwayTeam,
      HomeTeam,
      AwayTeamID,
      HomeTeamID,
      StadiumID,
      AwayTeamScore,
      HomeTeamScore,
      Updated,
      GlobalGameID,
      GlobalAwayTeamID,
      GlobalHomeTeamID,
      IsClosed,
      NeutralVenue,
      DateTimeUTC
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
      game.GameID,
      game.StadiumID,
      game.SeasonType,
      game.GameID,
      game.Season,
      game.SeasonType,
      game.Status,
      game.Day,
      game.DateTime,
      game.AwayTeam,
      game.HomeTeam,
      game.AwayTeamID,
      game.HomeTeamID,
      game.StadiumID,
      game.AwayTeamScore,
      game.HomeTeamScore,
      game.Updated,
      game.GlobalGameID,
      game.GlobalAwayTeamID,
      game.GlobalHomeTeamID,
      game.IsClosed,
      game.NeutralVenue,
      game.DateTimeUTC,
      game.SeriesInfo,
    ];

    await connection.query(query, values);
    console.log("Dados do jogo adicionados com sucesso ao banco de dados");
    res.status(200).send("Dados do jogo adicionados com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar dados do jogo ao banco de dados:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

import jwt from "jsonwebtoken";

app.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;
  console.log("Tentativa de login:", emailOrUsername);

  try {
    const query = "SELECT * FROM users WHERE email = ? OR username = ?";
    connection.query(query, [emailOrUsername, emailOrUsername], async (err, results) => {
      if (err) {
        console.error("Erro ao autenticar:", err);
        return res.status(500).json({ message: "Erro ao autenticar" });
      }

      if (results.length > 0) {
        const user = results[0];
        if (user.verificado_id === 2) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            const token = jwt.sign({ userId: user.id }, "seu_segredo_secreto", {
              expiresIn: "1h",
            });
            res.json({ user, token });
          } else {
            res.status(401).json({ message: "Credenciais inválidas" });
          }
        } else {
          console.log("Verifique a sua conta no seu email");
          res.status(401).json({ message: "Conta não verificada" });
        }
      } else {
        res.status(401).json({ message: "Credenciais inválidas" });
      }
    });
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    res.status(500).json({ message: "Erro ao autenticar" });
  }
});


const sendWelcomeEmail = async (email, userId) => {
  try {
    // Construa o link para verificar o usuário
    const verificationLink = `http://localhost:8000/verify-user/${userId}`;

    // Construa o corpo do e-mail com o link de verificação
    const emailBody = `
      <html>
        <head>
          <style>
            /* Estilos CSS para o e-mail */
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #333;
            }
            p {
              color: #666;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #fff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Bem-vindo ao nosso serviço!</h2>
            <p>Estamos muito felizes em tê-lo como parte da nossa comunidade.</p>
            <p>Para verificar sua conta, clique no botão abaixo:</p>
            <a href="${verificationLink}" class="button">Verificar Conta</a>
            <p>Se você não solicitou esta verificação, por favor, ignore este e-mail.</p>
            <p>Atenciosamente,<br/>A equipe do nosso serviço</p>
          </div>
        </body>
      </html>
    `;

    // Envie o e-mail de boas-vindas para o e-mail fornecido
    const resend = new Resend("re_WVgMm9nA_FvzVt2aFPQT4UL7HQ9uYisKB");
    await resend.emails.send({
      from: "Admin <admin@pap-miguel.online>",
      to: [email],
      subject: "Bem-vindo ao Nosso Serviço!",
      html: emailBody,
    });

    console.log("E-mail de boas-vindas enviado para:", email);
  } catch (error) {
    console.error("Erro ao enviar e-mail de boas-vindas:", error.message);
    throw new Error("Erro ao enviar e-mail de boas-vindas");
  }
};

app.get("/verify-user/:userId", async (req, res) => {
  const userId = req.params.userId;

  // Atualize o id_verificado do usuário para 2
  const updateQuery = "UPDATE users SET verificado_id = 2 WHERE id = ?";

  // Consulta para obter o nome de usuário do usuário
  const getusernameQuery = "SELECT username FROM users WHERE id = ?";

  connection.query(updateQuery, [userId], (updateErr, updateResults) => {
    if (updateErr) {
      console.error("Erro ao verificar usuário:", updateErr);
      return res.status(500).json({ message: "Erro ao verificar usuário" });
    }

    // Consulta para obter o nome de usuário do usuário
    connection.query(getusernameQuery, [userId], (getusernameErr, getusernameResults) => {
      if (getusernameErr) {
        console.error("Erro ao obter nome de usuário:", getusernameErr);
        return res.status(500).json({ message: "Erro ao obter nome de usuário" });
      }

      // Verificação bem-sucedida, enviando o nome de usuário junto com a resposta
      const username = getusernameResults[0].username;
      console.log("Usuário verificado com sucesso:", username);
      res.json({ message: "Usuário verificado com sucesso", username });
    });
  });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Verificar se o email já está em uso
  const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
  const usernameCheckQuery = "SELECT * FROM users WHERE username = ?";

  // Verificar se o username já está em uso
  connection.query(
    usernameCheckQuery,
    [username],
    async (usernameCheckErr, usernameCheckResults) => {
      if (usernameCheckErr) {
        return res.status(500).json({ message: "Erro ao verificar username" });
      }

      if (usernameCheckResults.length > 0) {
        return res.status(400).json({ message: "username já registrado" });
      }

      // Se o username não estiver em uso, verificar o email
      connection.query(
        emailCheckQuery,
        [email],
        async (emailCheckErr, emailCheckResults) => {
          if (emailCheckErr) {
            return res.status(500).json({ message: "Erro ao verificar email" });
          }

          if (emailCheckResults.length > 0) {
            return res.status(400).json({ message: "Email já registrado" });
          }

          // Se o email e o username não estiverem em uso, proceder com o registro
          try {
            const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds de hashing
            const registerQuery =
              "INSERT INTO users (email, password, username, rolesid, verificado_id) VALUES (?, ?, ?, 2, 1)";

            connection.query(
              registerQuery,
              [email, hashedPassword, username],
              (registerErr, registerResults) => {
                if (registerErr) {
                  console.error(registerErr);
                  return res.status(500).json({ message: "Erro ao registrar" });
                }

                const userId = registerResults.insertId;

                // Agora, envie o e-mail de boas-vindas após o registro
                sendWelcomeEmail(email, userId)
                  .then(() => {
                    console.log("E-mail de boas-vindas enviado para:", email);
                  })
                  .catch((error) => {
                    console.error(
                      "Erro ao enviar e-mail de boas-vindas:",
                      error.message
                    );
                  });

                res.json({
                  user: { id: userId, email, username, rolesid: 2, verificado_id: 1 },
                });
              }
            );
          } catch (registerError) {
            console.error(registerError);
            res.status(500).json({ message: "Erro ao registrar" });
          }
        }
      );
    }
  );
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
