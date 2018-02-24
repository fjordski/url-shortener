class Hash {
  hashString(){
    return Math.random().toString(36).substring(10);    
  }
}

module.exports = Hash;
