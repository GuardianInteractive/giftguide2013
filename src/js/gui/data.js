/**
 * Created by IntelliJ IDEA.
 * User: rb
 * Date: 10/02/2012
 * Time: 10:56
 */
var gui = gui || {};
gui.data = gui.data || {};

(function ()
{

    gui.data.DEFAULT_TIMEOUT = 10*1000;

    gui.data.Job = function(){
        _.extend(this, Backbone.Events);
    };
    gui.data.Job.prototype = {
        running: false,
        cancelled: false,
        completed: false,
        failed: false,
        failureSimulationRate: 0.0,
        delaySimulationMS: 0,
        go: function(){
            if(!this.running){
                this.failed = false;
                this.running = true;
                this.completed = false;
                this.cancelled = false;
                //simulate an error
                var delayTime = Math.random()*this.delaySimulationMS;
//                if(delayTime > 10000){
//                    console.log(delayTime);
//                }
                if(Math.random() < this.failureSimulationRate){
                    gui.data.DelayCall(delayTime, this._failure, this);
//                    this._failure();
                } else {
                    gui.data.DelayCall(delayTime, this._go, this);
//                    this._go();
                }
//                this._go();

            }
        },
        cancel: function(){
//            console.log('cancelling', this);
            if(!this.cancelled){
                this.cancelled = true;
                this.trigger('cancelled');
            }
        },
        _go: function(){},
        _success: function(){
//            console.log('success', this);
//            if(this.completed){
//                console.log('JOB IS ALREADY COMPLETE!');
//            }
            if(!this.completed && this.running && !this.cancelled){
                this.results = Array.prototype.slice.call(arguments);
                this.completed = true;
                this.running = false;
                var result = this.results.slice();
                result.splice(0, 0, 'success');
                this.trigger.apply(this, result);
//                this.trigger('success', this.results);
            }
        },
        _failure: function(){
//            console.log('failure: ', this);
            if(this.running && !this.cancelled){
                this.results = Array.prototype.slice.call(arguments);
                this.failed = true;
                this.running = false;
                var result = this.results.slice();
                result.splice(0, 0, 'failure');
                this.trigger.apply(this, result);
//                this.trigger('failure', result);
            }
        }
    };





    gui.data.RetryJob = function(){
    };
    gui.data.RetryJob.prototype = _.extend(new gui.data.Job(), {
        failCount: 0,
        maxAttempts: 3,
        _failure: function(){
//            console.log('failcount: ', this.failCount);
            if(this.running && !this.cancelled){
                this.failCount += 1;
                if(this.failCount < this.maxAttempts){
//                    console.log('retrying');
                    //try again
                    this._retry();
                } else {
                    //really fail
//                    console.log('complete failure');
                    var args = Array.prototype.slice.call(arguments);
                    this._completeFailure.apply(this, args);
                }
            }
        },
        _completeFailure: gui.data.Job.prototype._failure,
        _retry: function(){
            this._go();
        }
    });






    /*
     processes the 'set' parameter in parallel
     set is an obj of datajobs.
     sets is handled in parallel
     once all success we fire the success event!
     any error and we cancel and fire error
     */
    gui.data.ParallelJob = function(options){
        options = options || {};
        this.jobs = options.jobs || {};
        if(options.success){ this.bind('success', options.success); }
        if(options.failure){ this.bind('failure', options.success); }
    };
    gui.data.ParallelJob.prototype = _.extend(new gui.data.Job(), {
        _go: function(){
//            this.startTime = (new Date()).getTime();
            this.incompleteJobs = {};
            for(var s in this.jobs){
                var job = this.jobs[s];
                job._jobName = s;
                job.bind('success', _.bind(this._jobSuccess, this, job));
                job.bind('failure', _.bind(this._jobFailure, this, job));
                this.incompleteJobs[s] = job;
            }
            var launchCount = 0;
            for(var s in this.jobs){
                var job = this.jobs[s];
                job.go();
            }
        },
        _jobSuccess: function(job){
            var s = job._jobName;
            delete(this.incompleteJobs[s]);
            var someLeft = false;
            for(var s in this.incompleteJobs){
                someLeft = true;
                break;
            }
            var jobCount = 0;
            for(var s in this.incompleteJobs){
                ++jobCount;
            }
            if(!someLeft){
                //we are all done!

//                this.endTime = (new Date()).getTime();
//                var duration = this.endTime - this.startTime;
//                console.log('completed in ' + duration);

                var results = {};
                for(var s in this.jobs){
                    results[s] = this.jobs[s].results;
                }
                this._success(results);
            }
        },
        _jobFailure: function(job){
            for(var s in this.incompleteJobs){
                var job = this.incompleteJobs[s];
                job.cancel();
            }
            this._failure();
        }
    });


    gui.data.AJAXJob = function(url, params, timeout){
        this.url = url || '';
        this.params = params || {};
        this.timeout = timeout || gui.data.DEFAULT_TIMEOUT;
    };
    gui.data.AJAXJob.prototype = _.extend(new gui.data.RetryJob(), {
        _go: function(){

            var setup = {
                url: this.url,
                data: this.params,
                timeout: this.timeout,
                success: _.bind(this._success, this),
                failure: _.bind(this._failure, this)
            };

            $.ajax(setup);
        }
    });


    gui.data.JSONJob = function(url, params, timeout){
        this.url = url || '';
        this.params = params || {};
        this.timeout = timeout || gui.data.DEFAULT_TIMEOUT;
    };
    gui.data.JSONJob.prototype = _.extend(new gui.data.RetryJob(), {
        _go: function(){

            var setup = {
                url: this.url,
                dataType: 'json',
                data: this.params,
                timeout: this.timeout,
                success: _.bind(this._success, this),
                failure: _.bind(this._failure, this)
            };

            $.ajax(setup);
        }
    });


    gui.data.JSONPJob = function(url, params, callbackParameter, timeout){
        this.url = url || '';
        this.params = params || {};
        this.callbackParameter = callbackParameter || 'callback';
        this.timeout = timeout || gui.data.DEFAULT_TIMEOUT;
    };
    gui.data.JSONPJob.prototype = _.extend(new gui.data.RetryJob(), {
        _go: function(){

            var setup = {
                url: this.url,
                data: this.params,
                callbackParameter: this.callbackParameter,
                timeout: this.timeout,
                success: _.bind(this._success, this),
                failure: _.bind(this._failure, this)
            };

            $.jsonp(setup);
        }
    });

    gui.data.GoogleSpreadsheetJob = function(url){
        this.url = url || '';
        $.ss(this.url)
    };
    gui.data.GoogleSpreadsheetJob.prototype = _.extend(new gui.data.RetryJob(), {
        _go: function(){
            $.ss(this.url).send(_.bind(this._result, this));
        },
        _result: function(result, successArr){
            var success = successArr[0];
            if(success){
                this._success(result);
            } else {
                this._failure(result);
            }
        }
    });



    gui.data.DelayCall = function(delayMillis, call, scope){
        //
        var args = Array.prototype.slice.call(arguments);
        args = args.slice(3);

        var f = function(){
            call.apply(scope, args);
        }
            ;
        if(delayMillis <= 0){
            f();
        } else {
            setTimeout(f, delayMillis);
        }
    };

}());