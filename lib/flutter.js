import BaseGolok from './base_golok.js';

class Flutter extends BaseGolok{
    constructor(args, opts) {
        // Initiate from parent
        super(args, opts);

        // Registered this instance
        super.register('flutter', this);
    }

    generate(path, destination, otherTemplateDir){

    }
}