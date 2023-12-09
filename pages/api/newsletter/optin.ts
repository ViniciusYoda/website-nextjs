import { createClient } from "@supabase/supabase-js";
import sendGridMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

// Supabase Setup
// =========
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const dbClient = createClient(SUPABASE_URL, SUPABASE_KEY);
// =========

const httpStatus = {
  Success: 200,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
};

const controllerByMethod = {
  async POST(req: NextApiRequest, res: NextApiResponse) { // Cria coisas
    console.log(req.body.emailNewsletter);
    const email = req.body.emailNewsletter;

    // Fail Fast validation
    if(!Boolean(email) || !email.includes("@")) {
      res
        .status(httpStatus.BadRequest)
        .json({ message: "Você precisa enviar um email valido ex: teste@teste.com" });
      return;   
    }

    // Sanitize do email
    // - Remover potenciais códigos maliciosos
    // - Remover X coisas
    
    // Adiciona a pessoa na newsletter
    const { error } = await dbClient.from("newsletter_users").insert({ email: email, optin: true });
    // if (error) retorna resposta caso aconteça um problema
    
    // Cria usuários de fato do sistema
    await dbClient.auth.admin.createUser({ email: email });
    
    try {
      console.log(process.env.SENDGRID_KEY);
      sendGridMail.setApiKey(process.env.SENDGRID_KEY);
      
      await sendGridMail.send({
        to: "contato@mariosouto.com", // email
        from: "devsoutinho@mariosouto.com",
        subject: "Titulo do Email!",
        html: "Aqui vai o <strong>Conteúdo!!!</strong>"
      });

      res
        .status(httpStatus.Success)
        .json({ message: "Post request!" });
    } catch (err) {
      console.error(err);
      res
        .status(httpStatus.InternalServerError)
        .json({ message: "Falhamos em enviar seu email!" });
    }
  },
  async GET(req: NextApiRequest, res: NextApiResponse) { // Retorna coisas
    const { data, error } = await dbClient
                    .from("newsletter_users")
                    .select("*");

    console.log(data);
    console.log(error);

    res
      .status(httpStatus.Success)
      .json({ message: "Get request!", total: data.length });
  }
}

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const controller = controllerByMethod[request.method];
  if(!controller) {
    response
      .status(httpStatus.NotFound)
      .json({ message: "Nada encontrado aqui :(" });
    return;
  }
  
  controller(request, response);
}
// export default function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   console.log(request.method);
//   // Servidor
//   // Request e Response
//   // Body e Headers
//   // Status Http (https://httpstatusdogs.com/)
//   // Request Methods
//   const responseBody = { name: 'Mario Souto' };
//   response
//     .status(httpStatus.Success)
//     .json(responseBody); // Vira TEXTO Puro pra passar na rede
// }
