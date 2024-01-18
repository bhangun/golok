

class BaseSim{

    constructor(args, opts) {
        console.log('Ini adalah super')
        this.children = []
    }

    getInstances() { return this.children};

    register(name, instance){
        this.children.push({ 
            'name': name,
            'instance': instance
        })
    }
}

class Flutter extends BaseSim{
    constructor(args, opts) {
        super(args, opts) 
        super.register(
        'flutter',
            this
        )

        super.register(
            'quarkus',
            {'akuh':'ajah'}
        )
    }

    getMyInstance() {return super.getInstances()};

    get text() {return  'ini adalah text'}
}


const flut = new Flutter()

console.log(flut.getMyInstance()[0].object.text);

