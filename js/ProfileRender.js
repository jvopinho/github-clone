import { LanguageColors } from "./language-colors.js";

export class ProfileRender {
    static profilePictureElement = document.getElementById('profile-picture')
    static profileUsernameElement = document.getElementById('profile-username')
    static profileDisplayNameElement = document.getElementById('profile-display-name')
    static profileBioElement = document.getElementById('profile-bio')
    static profileDetailsElement = document.getElementById('profile-details')
    
    static readmeElement = document.getElementById('profile-readme')
    static pinnedReposElement = document.querySelector('.pinned-repositories')
    
    static markdownConverter = new showdown.Converter()
    
    static renderProfileInfos(user) {
        this.profileUsernameElement.textContent = user.login
        this.profileDisplayNameElement.textContent = user.name || user.login
        this.profileBioElement.textContent = user.bio || 'No bio available'
        this.profilePictureElement.src = user.avatar_url

        this.profileDetailsElement.innerHTML = ''

        if(user.company) {
            this.profileDetailsElement.innerHTML += `
                <p title="Company">🏢 ${user.company.startsWith('@') ? 
                    `<a href="https://github.com/${user.company.replace('@', '')}" target="_blank" rel="noopener noreferrer">${user.company}</a>` 
                    : user.company}
                </p>
            `
        }

        if(user.location) {
            this.profileDetailsElement.innerHTML += `
                <p title="Location">📍 ${user.location}</p>
            `
        }

        if(user.email) {
            this.profileDetailsElement.innerHTML += `
                <p title="Email">✉️ <a href="mailto:${user.email}">${user.email}</a></p>
            `
        }

        if(user.blog) {
            this.profileDetailsElement.innerHTML += `
                <p title="Website">🔗 <a href="${user.blog}" target="_blank" rel="noopener noreferrer">${user.blog}</a></p>
            `
        }
    }

    static renderPinnedRepositories(userName, pinnedRepos) {
        if(!pinnedRepos || pinnedRepos.length === 0) {
            this.pinnedReposElement.hidden = true
            return
        }

        let pinnedReposHtml = ''
        pinnedRepos.forEach(repo => {
            const [_, languageColor] = Object.entries(LanguageColors).find(([language]) => language.toLowerCase() === (repo.language || '').toLowerCase()) ?? ['Other', '#ccc']

            pinnedReposHtml += `
                <div class="pinned-repository">
                    <h2><a href="https://github.com/${repo.author}/${repo.name}" target="_blank" rel="noopener noreferrer">
                        ${repo.author != userName ? `<span style="font-weight: 400;">${repo.author}/</span>` : ''}${repo.name}
                    </a></h2>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="pinned-repository-overview">
                        <span><div class="language-badge" style="background-color: ${languageColor}"></div> ${repo.language || 'Unknown'}</span>
                        <span>⭐ ${repo.stars || 0} Stars</span>
                        <span>🪢 ${repo.forks || 0} Forks</span>
                    </div>
                </div>
            `
        })

        this.pinnedReposElement.innerHTML = `
            <span>Pinned</span>
            <div class="pinned-repositories-list">
                ${pinnedReposHtml}
            </div>
        `
        this.pinnedReposElement.hidden = false
    }

    static renderProfileReadme(userName, readmeContent) {
        if(!readmeContent || readmeContent.trim() === '') {
            this.readmeElement.innerHTML = ''
            this.readmeElement.hidden = true
            return
        }
        
        const readmeHtml = this.markdownConverter.makeHtml(readmeContent)
        
        const sanitizedReadmeHtml = DOMPurify.sanitize(readmeHtml)
        this.readmeElement.innerHTML = `
            <p class="profile-readme-source">
                <a href="https://github.com/jvopinho/jvopinho/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                    <span>${userName}</span> / <span>README</span>.md
                </a>
            </p>
        
            <div class="markdown">
                ${sanitizedReadmeHtml}
            </div>
        `
        this.readmeElement.hidden = false
    }
}