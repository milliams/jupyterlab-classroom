import {
    JupyterLab, JupyterLabPlugin, ILayoutRestorer, LayoutRestorer, ApplicationShell
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  ContentsManager
} from '@jupyterlab/services';

import {
  IStateDB
} from '@jupyterlab/coreutils';

import '../style/index.css';


/**
 * Initialization data for the classroom extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'classroom',
    autoStart: true,
    requires: [ICommandPalette, IStateDB, ILayoutRestorer],
    activate: (app: JupyterLab, palette: ICommandPalette, state: IStateDB, restorer: LayoutRestorer) => {
        console.log('JupyterLab extension "classroom" is activated!');

        // Add an application command
        const save_command: string = 'classroom:save';
        app.commands.addCommand(save_command, {
            label: 'Save layout state',
            execute: () => {
                state.fetch('layout-restorer:data').then((data) => {
                    const layout = JSON.stringify(data);

                    const file = new Blob([layout], {type: 'text/json'});

                    let atag = document.createElement("a");
                    document.body.appendChild(atag);
                    atag.href = window.URL.createObjectURL(file);
                    atag.download = 'layout.json';
                    atag.click();
                    document.body.removeChild(atag);
                });
            }
        });
        // Add the command to the palette.
        palette.addItem({command: save_command, category: 'Classroom'});

        // Add an application command
        const load_command: string = 'classroom:load';
        app.commands.addCommand(load_command, {
            label: 'Load layout state',
            execute: () => {
                let contents = new ContentsManager();
                contents.get('/layout.json').then((model) => {
                    console.log('layout text:', model.content);
                    const layout = JSON.parse(model.content);
                    console.log('layout:', layout);
                    state.save('layout-restorer:data', layout).then(() => {
                        console.log('saved state to DB');
                        state.fetch('layout-restorer:data').then((data: any) => {
                            console.log('state:', layout);
                        });
                        restorer.fetch().then((saved: ApplicationShell.ILayout) => {
                            console.log('layout fetched:', saved);
                            app.shell.restoreLayout(saved);
                        });
                    });
                });
            }
        });
        // Add the command to the palette.
        palette.addItem({command: load_command, category: 'Classroom'});
    }
};

export default extension;
