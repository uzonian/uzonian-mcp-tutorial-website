import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Table, Code } from "@/components/content";
import { Lab } from "@/components/Lab";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Development Environment" };

export default function Page() {
  return (
    <ChapterShell
      slug="environment"
      eyebrow="Chapter 3 · Build"
      title="Development Environment for Windows & VS Code"
      intro="Set up a comfortable, repeatable workspace. Install the tools once, add a few VS Code extensions, and you'll be ready to run and edit the server."
      learningGoals={[
        "Install every required tool on Windows",
        "Add the VS Code extensions that make Python and Azure work pleasant",
        "Open the project and run the local helper script",
        "Understand what the helper script automates",
      ]}
      toc={[
        { id: "software", label: "Required software" },
        { id: "extensions", label: "VS Code extensions" },
        { id: "open", label: "Open the project" },
        { id: "venv", label: "Virtual environment by hand" },
        { id: "helper", label: "The local helper script" },
      ]}
      summary={
        <ul>
          <li>
            Core tools: VS Code, Python 3.11+, Git, Azure CLI, Node.js LTS,
            PowerShell 7.
          </li>
          <li>Docker Desktop is optional — deployment uses ACR build.</li>
          <li>
            <Code>run_local.ps1</Code> creates the venv, installs deps, seeds{" "}
            <Code>.env</Code>, and starts the server.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "tools", label: "All required tools installed" },
        { id: "ext", label: "Python, Pylance, and Ruff extensions added" },
        { id: "open", label: "Project opens in VS Code" },
        { id: "script", label: "I understand what run_local.ps1 does" },
      ]}
    >
      <h2 id="software">Required software</h2>
      <Table
        headers={["Tool", "Purpose"]}
        rows={[
          ["Windows 11 or 10", "Target workstation environment"],
          ["VS Code", "Editor and integrated terminal"],
          ["Python 3.11 or later", "Runtime for the MCP server"],
          ["Git", "Source control"],
          ["Azure CLI", "Azure login, image build, deployment"],
          ["Node.js LTS", "Needed for MCP Inspector via npx"],
          ["PowerShell 7 or Windows PowerShell", "Shell used by the scripts"],
          [
            "Docker Desktop",
            "Optional locally — the deploy script uses ACR build, so local Docker isn't required",
          ],
        ]}
      />
      <Callout variant="beginner" title="Do I need Docker?">
        Not to get started. Deployment builds the container image in{" "}
        <Code>Azure Container Registry</Code>, so you can ship without Docker on
        your laptop. Install it only if you want to build images locally.
      </Callout>

      <h2 id="extensions">Recommended VS Code extensions</h2>
      <Table
        headers={["Extension", "Why"]}
        rows={[
          ["Python", "Python language support"],
          ["Pylance", "Type checking and IntelliSense"],
          ["Ruff", "Fast Python linting"],
          ["Azure Resources", "Azure navigation from VS Code"],
          ["Bicep", "Azure infrastructure authoring"],
          ["GitHub Actions", "Workflow file support"],
          ["Docker", "Container file support"],
        ]}
      />

      <h2 id="open">Open the project</h2>
      <CodeBlock
        language="powershell"
        code={`cd "C:\\Users\\uacholonu\\OneDrive - Microsoft\\Documents\\DevZone\\CoworkDev\\Plugin Projects\\My MCP Builds\\Microsoft Scout Opus 4.8\\jira-mcp-copilot-studio"
code .`}
      />
      <Callout variant="warning">
        Always quote Windows paths that contain spaces. The path above has
        several, so the surrounding quotes are required.
      </Callout>

      <h2 id="venv">Create a virtual environment by hand</h2>
      <p>
        The project ships <Code>scripts\\run_local.ps1</Code>, but it&apos;s
        worth doing this once yourself so you understand what it automates.
      </p>
      <CodeBlock
        language="powershell"
        code={`python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"`}
      />
      <Callout variant="tip" title="If activation is blocked">
        Run <Code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</Code>,
        then open a new PowerShell terminal and retry. This allows locally
        created, signed scripts to run for your user only.
      </Callout>

      <h2 id="helper">The local helper script</h2>
      <CodeBlock language="powershell" code={`.\\scripts\\run_local.ps1`} />
      <p>It:</p>
      <ol>
        <li>
          creates <Code>.venv</Code> if missing
        </li>
        <li>installs dependencies</li>
        <li>
          copies <Code>.env.example</Code> to <Code>.env</Code> if missing
        </li>
        <li>
          starts the server on <Code>http://localhost:8080</Code>
        </li>
      </ol>

      <Lab title="Prove your environment works" time="10 minutes" goal="Confirm every tool is installed and the server starts.">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Run each of these and note the version:{" "}
            <Code>python --version</Code>, <Code>git --version</Code>,{" "}
            <Code>node --version</Code>, <Code>az version</Code>.
          </li>
          <li>Open the project folder in VS Code.</li>
          <li>
            Run <Code>.\\scripts\\run_local.ps1</Code> and watch for the startup
            line.
          </li>
          <li>
            In a second terminal, run{" "}
            <Code>Invoke-RestMethod http://localhost:8080/healthz</Code>.
          </li>
        </ol>
        <p className="mt-2">
          Success: you see <Code>status: ok</Code>. If not, head to{" "}
          <a href="/troubleshooting/">Troubleshooting</a>.
        </p>
      </Lab>

      <VideoCard
        verified={false}
        concept="Python virtual environments in VS Code on Windows"
        level="beginner"
        searchQuery='Python virtual environment VS Code Windows tutorial (Microsoft OR "Visual Studio Code" official)'
        why="A visual walkthrough of selecting the interpreter and activating a venv in VS Code prevents the most common beginner setup mistakes."
      />
    </ChapterShell>
  );
}
