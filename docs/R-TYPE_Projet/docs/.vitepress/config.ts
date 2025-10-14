import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    lang: 'en-US',
    title: 'R-TYPE EPITECH PROJET',
    // base: process.env.NODE_ENV === 'production' ? '/2025-Team-Epibot-Docs/' : '/',

    base: ProcessingInstruction.env.NODE_ENV === 'production' ? '/R-TYPE_Projet/' : '/',
    link: '/',
    description: 'First part of R-type',

    head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', rel: 'stylesheet' }],
    ['script', { src: 'https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js' }],
    ['meta', { name: 'theme-color', content: '#00d4ff' }],
    ],

    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            // { text: 'Our Team', link: '/equipe' },
            { 
                text: 'Rtype_part1_for_Dev', 
                items: [
                { text: 'Game Engine', link: '/R-type_Part1/ECS/' },
                { text: 'Build System', link: '/R-type_Part1/Builder/' },
                { text: 'Server', link: '/R-type_Part1/Server/'},
                { text: 'Client', link: '/R-type_Part1/Client/' },
                { text : 'Overview', link: '/R-type_Part1/'},
                ]
            },
            { 
                text: 'Rtype_part1_for_user', 
                items: [
                { text: 'How to Build', link: '/R-type_Part1/Builder/' },
                { text: 'Commands', link: '/command' },
                ]
            },
        ],
        sidebar: [
            {
                text: 'Overview',
                items: [
                { text: 'The Challenge', link: '/' },
                { text: 'Our Team', link: '/equipe' },
                ],
            },
            {
                text: 'First Part R-type',
                collapsed: true,
                items: [
                {
                    text: 'GAME ENGINE',
                    link: '/R-type_Part1/ECS/',
                    collapsed: true,
                    items: [
                    { text: 'ECS Overview', link: '/R-type_Part1/ECS/' },
                    { text: 'Components', link: '/R-type_Part1/ECS/Component/component' },
                    { text: 'Systems Overview', link: '/R-type_Part1/ECS/System/' },
                    { text: 'ShooterSystem', link: '/R-type_Part1/ECS/System/Shooter' },
                    { text: 'DestroySystem', link: '/R-type_Part1/ECS/System/Destroysystem' },
                    { text: 'ColliderSystem', link: '/R-type_Part1/ECS/System/ColliderSystem'},
                    { text: 'SpawnSystem', link: '/R-type_Part1/ECS/System/SpawnSystem'},
                    { text: 'PhysicSystem', link: '/R-type_Part1/ECS/System/Physic'},
                    { text: 'InputSystem', link: '/R-type_Part1/ECS/System/InputSystem' },
                    // àçaniel{ text: 'MovementSystem', link: '/R-type_Part1/ECS/System/MovementSystem' },
                    { text: 'RenderSystem', link: '/R-type_Part1/ECS/System/RenderSystem' },
                    // { text: 'NetworkSystem', link: '/R-type_Part1/ECS/System/NetworkSystem' },
                    ]
                },
                {
                    text: 'BUILD PROJECT',
                    link: '/R-type_Part1/Builder/',
                    collapsed: true,
                    items: [
                    { text: 'Build Overview', link: '/R-type_Part1/Builder/' },
                    { text: 'Build in Linux', link: '/R-type_Part1/Builder/build_linux.md' },
                    { text: 'Build in Windows', link: '/R-type_Part1/Builder/build_windows.md' },
                    { text: 'common problems', link: '/R-type_Part1/Builder/build_common_problems.md' },
                    ]
                },
                {
                    text: 'SERVER',
                    link: '/R-type_Part1/Server/',
                    collapsed: true,
                    items: [
                    { text: 'Server Overview', link: '/R-type_Part1/Server/' },
                    { text: 'Server Implementation', link: '/R-type_Part1/Server/server' },
                    ]
                },
                {
                    text: 'CLIENT',
                    link: '/R-type_Part1/Client/',
                    collapsed: true,
                    items: [
                    { text: 'Client Overview', link: '/R-type_Part1/Client/' },
                    { text: 'Client Implementation', link: '/R-type_Part1/Client/client' },
                    ]
                },
                {
                    text: 'Protocol',
                    link: '/R-type_Part1/Protocol/',
                    collapsed: true,
                },
                ],
            }
        ],
        footer: {
            copyright: '© 2025 Kalambo Daniel — Projet R-TYPE'
        },
    },
    vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: '@import "./theme/custom.css";'
        }
      }
    }
    },

    markdown: {
        theme: {
         light: 'github-light',
         dark: 'github-dark'
        },
    lineNumbers: true
    }
})
