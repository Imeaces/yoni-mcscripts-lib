class A{
  constructor(){
    return new B();
  }
  val = 1
}

class B{
  val = 2
}

let a = new A();
console.log(a instanceof A);
console.log(a instanceof B);
console.log(a.val);
