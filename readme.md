# AI Job Auto-Apply System

<p>
This repository contains a limited version of the AI Job Auto-Apply System, focused on the resume creation and document generation features. The full automation platform remains private. You can access the live tool here: [Add your website link here].
</p>

<p>
The AI Job Auto-Apply System is an automation platform that discovers relevant job openings, analyses their requirements, generates tailored application documents, and applies automatically across multiple job portals. The system combines browser automation, structured storage, and locally hosted language models to streamline large-scale job searching.
</p>

## Project Overview
This application continuously scans platforms such as LinkedIn, Naukri, and Apna to detect recent job openings matching configured keywords. It evaluates each job description, prepares tailored documents, and proceeds with automated or assisted applications. The system is designed to function both as a fully automated pipeline and as a decision-support tool for manual applications, typically processing 100–250 listings per run.

![alt text](sorce/applying.gif)

## System Flow

The first stage collects structured job data from supported portals using browser automation. It captures job descriptions, company information, metadata, and application requirements.

![alt text](sorce/resume.gif)

The second stage focuses on intelligent processing. Locally hosted language models analyse job descriptions, generate ATS-friendly resumes and cover letters, fill missing fields, and score relevance before applying. Walk-in drives are detected automatically, and their details are stored as structured JSON for reuse.

The final stage handles persistence and tracking. All job records, generated resumes, and application statuses are stored in SQL, enabling filtering, analytics, and historical tracking.

## Manual Assistance Layer

Alongside automation, the system offers a manual workflow where users can review generated resumes, modify documents, and apply selectively. A smart filtering engine ranks listings by relevance and consolidates them into a manageable queue.



## Technology Stack

### Core Technologies <br>
<img height="40" src="https://skillicons.dev/icons?i=selenium,git,html,js,css,python,flask,sqlite,mysql,docker,github,githubactions" />

### Additional Components

The following tools are used but do not have official SkillIcons representations:

- Ollama for hosting local language models
- Local LLMs (e.g., Gemma family) for document generation and JD analysis
- SQL-based tracking layer for application history and analytics
- Selenium for browser automation and scraping

## Supported LLMs
| Model               | Hosting | Usage                                          |
| ------------------- | ------- | ---------------------------------------------- |
| Gemma        | Ollama / Cloud  | Resume generation, JD scoring, form completion |
| Lama         | Ollama  | Resume generation, JD scoring, form completion |

## Configuration
Users can configure job keywords, posting time windows, supported platforms, model selection, resume templates, and application limits. This makes the system adaptable to different job markets and search strategies.


## Disclaimer
This project is intended for educational and productivity purposes. Users should ensure compliance with the terms of service of any platform they automate.

