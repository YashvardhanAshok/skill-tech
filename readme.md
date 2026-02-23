## AI Job Auto-Apply System

<p>
This repository contains a limited public version of the AI Job Auto-Apply System, mainly showcasing the resume generation and document workflow. The full automation platform remains private. You can access the live tool by 
<a href="https://yashvardhanashok.github.io/skill-tech/SkillSnap" target="_blank">clicking here</a>.
<br>
The AI Job Auto-Apply System automatically finds relevant job openings, generates tailored application documents, and helps streamline large-scale job searching using automation, structured storage, and locally hosted language models.
</p>

## Supported Platforms

The system supports multiple job platforms across web and mobile environments. For platforms where automation is permitted, the application can automatically discover listings, generate documents, and submit applications. For others, it assists users by preparing tailored resumes, extracting key job data, and guiding the manual application process.

![alt text](sorce/applying.gif)

| Platform                                         | AUTO | Manual |
| :----------------------------------------------- | :--: | :----: |
| LinkedIn, Naukri, Indeed, Apna (Web/Android App) | YES  |  YES   |
| Wellfound                                        |  NO  |  YES   |

---

## Resume Creation And Mangment

The system includes an intelligent resume generation pipeline that creates job-specific, ATS-friendly resumes based on the job description. Each generated resume is stored, versioned, and linked to its corresponding job entry, allowing users to review, edit, reuse, or export documents at any time through the interface.

![alt text](sorce/resume.gif)

## Manual Assistance Layer

Alongside automation, the system offers a manual workflow where users can review generated resumes, modify documents, and apply selectively. A smart filtering engine ranks listings by relevance and consolidates them into a manageable queue.

![alt text](sorce/manval.gif)

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

| Model | Hosting        | Usage                                          |
| ----- | -------------- | ---------------------------------------------- |
| Gemma | Ollama / Cloud | Resume generation, JD scoring, form completion |
| Lama  | Ollama         | Resume generation, JD scoring, form completion |

## Configuration

Users can configure job keywords, posting time windows, supported platforms, model selection, resume templates, and application limits. This makes the system adaptable to different job markets and search strategies.

## Disclaimer

This project is intended for educational and productivity purposes. Users should ensure compliance with the terms of service of any platform they automate.
