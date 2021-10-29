# [Maurya Editor](https://mauryaeditor.com)

    Maurya Editor is an open source tool from Quaffle's Rapid Product Development kit.

    Every action performed in the editor produces a stream of event. These events are then processed by different compilers to generate code for different platforms/environments. The generated code may run inside some runtime.

<a name="philosophies"></a>

## Core philosophies

    1. Extensibility - The Editor can be extended in multiple dimensions such as adding new components or adding an entirely new feature in the editor.

    2. Software Developer friendly - The Editor is focused on software developers experience in their day to day work. The generated code will be of high quality and always accessible via various tools.

    3. Inclusive - The Editor can be packaged in different ways to make it useful for citizen developers.

<a name="set-local-copy"></a>

## Setting Up a Local Copy

    You will need `npm >= 6.14.12 ` and `node >= v14.16.1`.

    ```bash
        git clone https://github.com/MauryaEditor/maurya-editor-web.git
        cd maurya-editor-web
        npm install
    ```

    Verify that everything is working correctly by running `npm run start` or `npm run build`
