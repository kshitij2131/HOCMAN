# Running the React Native Application

## Execution Steps
1. **Open Terminals**: Open two terminal windows.

2. **Ensure Both Terminals Are in Project Directory**: Navigate to the project directory in both terminals using the `cd` command:
    ```
    cd /path/to/project/directory
    ```

3. **Type Commands**: In each terminal, execute the following commands:
   - Terminal 1:
       ```
       command 1
       command 2
       npx react-native run-android
       ```
   - Terminal 2:
       ```
       command 1
       command 2
       npx react-native start
       ```

   Executing "command 1" and "command 2" in both terminals is just a precautionary measure.
   For command 1 and 2 refer to 4. 

4. **Verify Environment Variables**:
   - If you encounter a JAVA_HOME or ANDROID_HOME environment variable error, use the following commands to set them:
       ```
       export JAVA_HOME=<path-to-your-java-installation-directory>
       export ANDROID_HOME=<path-to-android-sdk>
       ```

   Note: You might need to set these environment variables every time you open a new terminal session. You can check if they are set correctly by running `echo $JAVA_HOME` or `echo $ANDROID_HOME`.

5. **Safe Execution**:
   - It's safe to execute the environment variable commands mentioned above before starting a new session to ensure smooth execution.
