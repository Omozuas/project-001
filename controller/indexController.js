class IndexController{
    static  index(req,res){
        res.send('<a href="/auth/google">auth google</a>')
    }
    static home(req,res){
        res.send('hello from home Product controller')
    }
}

module.exports=IndexController;