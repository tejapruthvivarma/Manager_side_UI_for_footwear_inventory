#!/usr/bin/perl

# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1

use DBI;
use CGI;

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn037";
my $username = "jadrn037";
my $password = "button";
my $database_source = "dbi:mysql:$database:$host:$port";
my $response = "";

my $dbh = DBI->connect($database_source, $username, $password)
or die 'Cannot connect to db';

my $q = new CGI;
my $sku = $q->param("sku");

my $query = "SELECT sku_id FROM product WHERE sku_id='$sku';";
            
my $sth = $dbh->prepare($query);
$sth->execute();

$count = $sth->rows;

while(my @row=$sth->fetchrow_array()) {    
    $response = $row[0];
    }
if($response) {
    $response = "duplicate"; 
    }    
else {
    $response = "ok";
    }    
$sth->finish();
$dbh->disconnect();
    
print "Content-type: text/html\n\n";
print $response;               