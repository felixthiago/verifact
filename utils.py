# R1JPUV9BUEk9Z3NrX2FXUjdKbFc4M3VIT2QyU2tIUDJRV0dkeWIzRllTRmtYejRJdkxuRWJBWkdkcTE3SlNYVmcKR09PR0xFX0ZBQ1RfQVBJPUFJemFTeURwakZGWVVialJlU1lQMkZ1dkFZSDl0VmVPMU9CbHEzUQ==

import os
from json import loads

from groq import Groq

from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("GROQ_API")
MODEL_ID = "llama-3.3-70b-versatile"

client = Groq(api_key = API_KEY)

def clean_json_string(text: str) -> str:
    import re
    text = re.sub(r'```json\s*|```', '', text)
    return text.strip()

async def refine_claim(raw_claim: str) -> dict:
    dev_mode = os.getenv("DEV_MODE")
    if dev_mode == True:
        return {
                "category": "dev_mode",
                "verification": "false",
                "confidence": "high",
                "explanation": "A afirmação de que vacinas causam câncer é falsa e amplamente desmentida por verificações de fatos. Múltiplas fontes, incluindo estudos científicos e a OMS, classificam como 'falso' ou 'enganoso' diversas alegações que tentam associar vacinas (especialmente as de COVID-19) ao surgimento de câncer, ao 'turbo câncer', ou a outras doenças graves em crianças e adultos. Não há evidências científicas que comprovem um vínculo causal entre a vacinação e o desenvolvimento de câncer. As verificações analisaram e refutaram teorias sobre o vírus SV40 em vacinas, supostos aumentos de casos de câncer em países vacinados, e estudos que alegadamente mostram crianças vacinadas mais doentes, confirmando a inexistência de fundamento para tais alegações.",
                "labels": ["anti-vacina"],
                "sources": [
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www.estadao.com.br",
                "https://www1.folha.uol.com.br",
                "https://www.estadao.com.br"
                ],
                "sentiment": "Alarmista"
            }

    prompt = f"""
        **Texto para analise:** {raw_claim}    

        Você é um assistente de checagem de fatos. remova links, hashtags, menções e emoji no texto. Sua tarefa é analisar o texto a seguir e fornecer uma versão concisa e refinada da informação, para uma analise posterior no google fact check tools(apenas reformule a expressão para ser passada para o google fact check, não forneça comentarios adicionais ou explicação).
        Considere que o texto pode conter informações imprecisas, exageradas ou irrelevantes, seu objetivo a principio classificar a relevancia impacto da informação, em categorias de três .
        - C1: se referem a informações que são obviamente falsas, e irrelevantes para checagem do google facts, ou seja não possuem impacto relevante, e não devem ser checadas.
        - C2: se referem a informações que possuem um impacto relevante, ou seja podem influenciar um perfil, pensamento ou indaguem, mesmo que de forma sutil o usuario sobre o conhecimento de um fato, e portanto devem ser checadas.
        - C3: se referem a informações que possuem um impacto muito relevante, que certamente influenciam, de forma significativa o usuario sobre seu pensamento e portanto devem ser checadas.
        caso o modelo não consiga identificar o nível de impacto precisamente, deve classificar a informação no nivel C2. 

        caso a informação seja classificada como C1, o modelo deve retornar em claim uma breve analise sobre essa informação, explicando de maneira BEM HUMORADA e CONCISA o motivo da classificação.
        se for C2 ou C3, 'claims' deve ser uma lista de afirmações curtas e factuais
        caso o modelo receba afirmações dubias de serem checadas pelo google fact check tools, como por exemplo fofocas e rumores, afirmações obvias, classificações incorretas e afirmações pessoais, deve classificar a informação como C1 e explicar de maneira humorada o motivo da classificação.
        ## RETORNE SOMENTE UM JSON SEGUINDO ESTE ESQUEMA, SEM NENHUMA EXPLICAÇÃO ADICIONAL, SEM `, NEM PONTUAÇÃO, NEM FORMATAÇÃO, APENAS O JSON:
        {{
            "claims": "[lista de afirmações refinadas para checagem no google fact check]",
            "category": "[C1, C2, or C3]",  
        }}
        ```
    """

    try:
        raw_response = client.with_raw_response.chat.completions.create(
            model = MODEL_ID,
            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"texto para analise > {raw_claim}"}
            ],
            response_format = {"type": "json_object"}
        )
        print(raw_response.headers.get('x-ratelimit-remaining-requests'))

        response = raw_response.parse()
        content = response.choices[0].message.content

        if content is None:
            raise ValueError('null response from gemini')
    
        print(response.choices[0].message.content)
        cleaned_content = clean_json_string(content)

        return loads(cleaned_content)

    except Exception as e:
        print(f'erro > {e}')
        return {
            "claims": raw_claim[:300],
            "category": "C1",
            "error": str(e)
        }

def syntesize_claim(raw_text: str, google_results: list, category: str):
    if not google_results:
        return {
            "verification": "NOT VERIFIED",
            "confidence": "LOW",
            "Explanation": "Nenhuma checagem oficial foi encontrada para este fato específico",
            "Sources": [],
            "Sentimental": "Neutral"
        }

    prompt = f"""
    Você é um assistente de checagem de fatos que agora precisa dar um veredito final sobre um fato checado com informações pelo google fact check tools. Considere:
    - O texto original da afirmação, tendo em vista tom de humor ou contexto social: {raw_text}
    - A categoria de impacto da afirmação: {category} (C1, C2, OU C3 sendo C1 o menos relevante e C3 o mais relevante) 
    - Os resultados de checagem do google fact check tools: {google_results}

    Retorne APENAS um JSON seguindo este esquema:
    {{
        "verification": "VERIFICADO | PARCIALMENTE VERIFICADO | NÃO VERIFICADO | FALSO",
        "category": "C1 | C2 | C3",
        "confidence": "ALTO | MÉDIO | BAIXO",
        "explanation": "Explicação concisa de no máximo 2 parágrafos",
        "bias": "Detecção de viés ou 'None'",
        "sources": ["Lista de URLs das fontes principais"],
        "sentiment": "Tom emocional da mensagem original"
    }}
    """

    try:
        response = client.chat.completions.create(
            model = MODEL_ID,
            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Dê um veredito final sobre a afirmação com base nas informações disponíveis."}
            ],
            response_format = {"type": "json_object"}
        )

        content = response.choices[0].message.content

        if content is None:
            raise ValueError('null response from gemini')
        
        cleaned_content = clean_json_string(content)

        return loads(cleaned_content)

    except Exception as e:
        print(f'erro > {e}')
        return {
            "error": str(e),
            "verification": "NOT VERIFIED",
            "confidence": "LOW",
            "explanation": "Ocorreu um erro ao sintetizar a informação",
            "sources": [],
            "sentiment": "Neutral"
        }
    