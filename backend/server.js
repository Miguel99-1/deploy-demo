const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
app.use(cors());  // Adicione esta linha
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
      jogadores.PlayerID,
      jogadores.FirstName,
      jogadores.LastName,
      jogadores.Position,
      Equipas.Name AS TeamName
  FROM 
      jogadores
  INNER JOIN Equipas ON jogadores.TeamID = Equipas.TeamID;
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
app.put("/api/players/:id", (req, res) => {
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
app.delete("/api/players/:id", (req, res) => {
  const playerId = req.params.id;

  const deleteQuery = `
    DELETE FROM Jogadores
    WHERE PlayerID = ?;
  `;

  connection.query(deleteQuery, [playerId], (err, result) => {
    if (err) {
      console.error("Erro ao excluir jogador:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      console.log("Jogador excluído com sucesso");
      res.status(200).send("Jogador excluído com sucesso");
    }
  });
});

app.put("/updateData/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (isNaN(id)) {
    return res.status(400).send("PlayerID inválido");
  }

  const updateQuery = `
    UPDATE jogadores
    SET 
      FirstName = ?,
      LastName = ?,
      Position = ?
      -- Adicione outros campos aqui
    WHERE PlayerID = ?;
  `;

  const values = [
    updatedData.FirstName,
    updatedData.LastName,
    updatedData.Position,
    id // Usar a variável 'id' para identificar o jogador
  ];

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
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
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
      Equipas.TeamID,
      Equipas.TeamKey,
      Equipas.City,
      Equipas.Name AS TeamName
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
      City = ?,  -- Adicione outros campos aqui
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
      INSERT INTO Estadios (StadiumID, Active, Name, Address, City, State, Zip, Country, Capacity, GeoLat, GeoLong)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
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

app.post('/login', (req, res) => {
  const { email, password, rolesid } = req.body;
  console.log('Tentativa de login:', email);
  const query = `SELECT * FROM users WHERE email = '${email}'`;

  connection.query(query, async (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao autenticar' });
      }

      if (results.length > 0) {
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
              res.json({ user });
          } else {
              res.status(401).json({ message: 'Credenciais inválidas' });
          }
      } else {
          res.status(401).json({ message: 'Credenciais inválidas' });
      }
  });
});

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aluno221014@epad.edu.pt", // Replace with your Gmail email address
    pass: "Miguel2006", // Replace with your Gmail password
  },
});

const verificationCodes = {};

const generateVerificationCode = () => {
  // Gera um código de verificação de 4 dígitos
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendVerificationEmail = (email, verificationCode) => {
  const mailOptions = {
    from: "aluno221014@epad.edu.pt",
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Verificar se o email já está em uso
  const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';

  connection.query(emailCheckQuery, [email], async (emailCheckErr, emailCheckResults) => {
    if (emailCheckErr) {
      return res.status(500).json({ message: 'Erro ao verificar email' });
    }

    if (emailCheckResults.length > 0) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    // Se o email não estiver em uso, proceder com o registro
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds de hashing
      const registerQuery = 'INSERT INTO users (email, password, rolesid) VALUES (?, ?, 2)';

      connection.query(registerQuery, [email, hashedPassword], (registerErr, registerResults) => {
        if (registerErr) {
          return res.status(500).json({ message: 'Erro ao registrar' });
        }

        const userId = registerResults.insertId;
        res.json({ user: { id: userId, email, rolesid: 2 } });
      });
    } catch (registerError) {
      console.error(registerError);
      res.status(500).json({ message: 'Erro ao registrar' });
    }
  });
});



// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
