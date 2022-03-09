const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            "@component-background": "#001529",
                            "@text-color": "white",
                            "@primary-5": "white",
                            "@primary-color": "#4621a2",
                            "@heading-color": "white",
                            "@layout-header-background": "#001529", //header background
                            "@menu-item-active-bg": "#4621a2", //menu top color
                            "@menu-dark-item-active-bg": "#4621a2", //menu top color
                            "@link-color": "white", //green color for text
                            "@timeline-dot-bg": "transparent",
                            //table
                            "@table-bg": "#001529",
                            "@table-header-bg": "#001529",
                            "@table-header-color": "white",
                            "@table-row-hover-bg": "#4621a2",
                            //table pagination
                            "@pagination-item-bg": "#001529",
                            "@pagination-item-bg-active": "#4621a2",
                            "@pagination-item-input-bg": "#001529",
                            //button
                            "@btn-link-hover-bg": "#001529",
                            //icons
                            "@icon-color-hover": "#001529",
                            "@icon-color": "white",
                            //items
                            "@item-hover-bg": "#4621a2",
                            //alerts 
                            "@alert-message-color": "#ff7875",
                            "@alert-warning-bg-color": "#001529",
                            "@alert-warning-border-color": "#001529",
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};