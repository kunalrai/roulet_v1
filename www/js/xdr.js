; (function (window) {

    "use strict";

    var config = window.config = {
        host: ""
    };

    var parseParams = window.parseParams = function (search) {
        if (!search) {
            search = document.location.search;
        }
        if (!search) {
            return {};
        }
        return (/^[?#]/.test(search) ? search.slice(1) : search)
          .split('&')
          .reduce(function (params, param) {
              var A = param.split('=');
              params[A[0]] = A[1] ? decodeURIComponent(A[1].replace(/\+/g, ' ')) : '';
              return params;
          }, {});
    };

    var readystatechanged = window.readystatechanged = function (response, success, failure) {
        function onError(error) {
            if (typeof failure === 'function') {
                failure(error);
            }
        }
        function onSuccess(responseJSON) {
            if (typeof success === 'function') {
                success(responseJSON);
            }
        }
        if (response.status !== 200) {
            return onError(response);
        } else {
            return onSuccess(response);
        }
    };

    var onxdr = window.onxdr || function () {
    };

    var xdr = window.xdr = function (options, success, failure) {
        if (!(typeof (options) === 'object') || !('JSON' in window)) {
            return;
        }
        // Setup the default 'onreadystatechanged' handler if one is not specified.
        if (typeof options.onreadystatechanged !== 'function') {
            options.onreadystatechanged = function (response) {
                window.readystatechanged(response, success, failure);
            };
        }
        // Number of attempts allowed before erroring out.
        var attempts = 3, doXdr = function () {
            var TIMEOUT = 456789;
            var xhr
                , timer = setTimeout(function () {
                    dispose({
                        readyState: 0,
                        status: 500,
                        responseText: "",
                        error: "Timeout"
                    });
                }, options.timeout || TIMEOUT)
                , async = (typeof (options.async) !== 'undefined') ? options.async !== false : true
                , setHeaders = function () {
                    if (xdr.trace) {
                        console.log("Content-Type: text/plain; charset=utf-8");
                    }
                    var jwt = options.jwt || localStorage.getItem(".jwt") || "";
                    if (jwt) {
                        xhr.setRequestHeader("Authorization", "Bearer " + jwt);
                    }
                    xhr.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                }
                , dispose = function (response) {
                    if (!timer) return dispose;
                    clearTimeout(timer);
                    timer = null;
                    if (xhr) {
                        xhr.onreadystatechange = xhr.onerror = xhr.onload = null;
                        if (xdr.trace) {
                            var s = xhr.getAllResponseHeaders().trim();
                            if (s) console.log(s);
                            s = xhr.responseText;
                            if (s) console.log(s);
                        }
                        xhr.abort && xhr.abort();
                        xhr = null;
                    }
                    if (response) {
                        dispose.response = response;
                        notify();
                    }
                    return dispose;
                }
                , notify = function () {
                    if (options && typeof options.onreadystatechanged === 'function') {
                        try {
                            var response;
                            try {
                                response = dispose.response;
                                if (response && response.readyState === 4
                                    && response.responseText
                                    && typeof response.responseText === 'string'
                                    && response.responseText.length > 0
                                    && (response.responseText[0] === '{' || response.responseText[0] === '[')) {
                                    response.responseJSON = JSON.parse(response.responseText);
                                }
                            } catch (parserError) {
                                console.error(parserError);
                            }
                            if (!response) {
                                response = {
                                    readyState: 0,
                                    status: 500,
                                    responseText: "",
                                    error: "Error"
                                };
                            }
                            options.onreadystatechanged(response, dispose);
                        } catch (clientError) {
                            console.error(clientError);
                        }
                    }
                };
            try {
                xhr = new XMLHttpRequest();
                /**
                 *   0: request not initialized
                 *   1: server connection established
                 *   2: request received
                 *   3: processing request
                 *   4: request finished and response is ready
                 */
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        dispose({
                            readyState: xhr.readyState,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            responseText: xhr.responseText
                        });
                    } else if (xhr.readyState === 0) {
                        if (attempt >= 3) {
                            dispose({
                                readyState: xhr.readyState,
                                status: xhr.status,
                                statusText: xhr.statusText,
                                responseText: xhr.responseText
                            });
                        }
                    }
                };
                if (!options.method) {
                    if (options.content) {
                        options.method = "POST";
                    } else {
                        options.method = "GET";
                    }
                }
                xhr.open(
                    options.method,
                    options.url, async);
                xhr.timeout = TIMEOUT;
                var data;
                if (options.content) {
                    data = options.content;
                }
                if (xdr.trace) {
                    console.log(options.method + " " + options.url + " HTTP/1.1");
                }
                setHeaders();
                if (xdr.trace && data) console.log(JSON.stringify(data));
                if (data) {
                    if ((typeof data === 'object') && (data.toString() !== "[object FormData]")) {
                        data = JSON.stringify(data);
                    }
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            }
            catch (networkError) {
                attempts--;
                // Try again.
                if (attempts <= 0) {
                    dispose({
                        readyState: 0,
                        status: 500,
                        responseText: "",
                        statusText: networkError.error || "NetworkError"
                    });
                    return dispose;
                } else {
                    dispose();
                    return doXdr();
                }
            }
            return dispose;
        };

        return doXdr();
    };

    if (typeof onxdr === 'function') {
        onxdr();
    }

}(window));