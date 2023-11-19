# connect to digital asset broker with nodejs
1. Get current millisecond timestamp.
2. Set query parameters as key-value pairs: key=value (signature related value must not be URL-encoded).
3. Sort the key-value pairs in ascending ASCII order by key and concatenate with & (include timestamp).
4. Concatenate above result after PATH with ? to generate PATH_URL.
5. Concatenate METHOD and PATH_URL.
6. Concatenate related entity body of POST and DELETE after step 5. Skip this step if there is no entity body.
7. Use API Secret and the above result to generate HMAC SHA256 code, then convert it to hexadecimal.
8. Assign the hex result to PIONEX-SIGNATURE, add it to Header and send request.