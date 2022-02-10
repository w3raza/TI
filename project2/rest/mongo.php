<?php
  
//require 'vendor/autoload.php' ;
  
class db {
    private $user = "9zaczyk" ;
    private $pass = "pass9zaczyk";
    private $host = "172.20.44.25";
    private $base = "9zaczyk";
    private $coll = "user";
    private $collSession = "session";
    private $collAnkieta = "ankieta";
    private $conn;
    private $dbase;

    private $collection;
    private $SessionColl;
    private $AnkietaColl;
  
  
  
    function __construct() {
      //$this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
      $this->conn = new MongoDB\Client("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");    
      //$this->dbase = $this->conn->selectDB($this->base);
      //$this->collection = $this->dbase->selectCollection($this->coll);
      $this->collection = $this->conn->{$this->base}->{$this->coll};
      $this->SessionColl= $this->conn->{$this->base}->{$this->collSession};
      $this->AnkietaColl= $this->conn->{$this->base}->{$this->collAnkieta};
    }
  
    function select() {
      $cursor = $this->collection->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }

    function selectAnkieta() {
      $cursor = $this->AnkietaColl->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }

    function register($user){
      $count = $this->collection->count(['username' => $user['username']]);
      if($count==0){
          $ret = $this->collection->insertOne($user);
       }
        return $ret;
    }

    public function login($array){
      $name = $array['username'];
      $pass = $array['password'];
      $count =  $this->collection->count(['username' => $name, 'password' => $pass]);
      if($count == 0)
        $ret = false;
      else{
        //zakodowanie sesji
        $sess_id = md5(uniqid($name, true));
        $start_time = date('Y-m-d H:i:s', time());
        $record = array('sessionID' => $sess_id,'start' => $start_time);
        $ret = $this->SessionColl->insertOne($record);
      }
      return $sess_id;
    }

    function session($arr) {
        $tmp =  $this->SessionColl->findOne(array('sessionID' => $arr['sessionID']));
        if($tmp != NULL){
          $start_time = $tmp['start'];
          $date = DateTime::createFromFormat("Y-m-d H:i:s", $start_time);
          $current_time = new DateTime('now');
          $diff = $current_time->getTimestamp() - $date->getTimestamp();
          if($diff > (10*60))
          {
            $this->SessionColl->remove(array('sessionID' => $arr['sessionID']));
            return false;
          }
        }
        else{
          return false;
        }
        return true;
      }

      public function logout($sess){
        $tmp =  $this->SessionColl->find(array('sessionID' => $sess));
        if($tmp != NULL){
          $this->SessionColl->deleteOne(array('sessionID' => $sess));
          return true;
        }
        else
          return false;
       
      }
      
      //ankieta
      function insert($data) {
        $ret = $this->AnkietaColl->insertOne($data);
        return $ret;
      }
  
    function insertUser($user) {
      $ret = $this->collection->insertOne($user) ;
      return $ret;
    }
  
    function update($ident,$user,$flag) {
      if ( $flag ) {
         $rec = new MongoDB\BSON\ObjectId($ident);
         $filter = array ( '_id' => $rec );
      } else {
         $filter = array ( 'ident' => (int)$ident );//gdy przejmujemy $ident z query_string mamy tekst, a w bazie danych integery
      }
      $update = array ( '$set' => $user );
      //$option = array ( 'w' => 1 );
      //$ret = $this->collection->update($filter,$update,$option);
      $updresult = $this->collection->updateOne($filter,$update);
      //return $ret['nModified'];
      $ret = $updresult->getModifiedCount();
      return $ret;
    }
  
    function delete($ident,$flag) {
      if ( $flag ) {
         $rec = new MongoDB\BSON\ObjectId($ident);
         $filter = array ( '_id' => $rec );
      } else {
         $filter = array ( 'ident' => (int) $ident );//gdy przejmujemy $ident z query_string mamy tekst, a w bazie danych integery
      }
      //$option = array( 'justOne' => true, 'w' => 1 );
      //$ret = $this->collection->remove($filter,$option);
      $delresult = $this->collection->deleteOne($filter);
      $ret = $delresult->getDeletedCount(); 
      //return $ret['n'];
      return $ret;
    }    
}
?>