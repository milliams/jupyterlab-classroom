import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the classroom extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'classroom',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension classroom is now activated!');
  }
};

export default extension;
