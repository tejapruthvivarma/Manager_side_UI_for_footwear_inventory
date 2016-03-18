#!/usr/bin/perl
# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1
use DBI;


my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn037";
my $username = "jadrn037";
my $password = "button";
my $database_source = "dbi:mysql:$database:$host:$port";
my $response = "";

	
my $dbh = DBI->connect($database_source, $username, $password) 
or die 'Cannot connect to db';

my $query = "SELECT vendor_id, vendor_name FROM vendor";

            
my $sth = $dbh->prepare($query);
$sth->execute();

while(my @row=$sth->fetchrow_array()) {    
    $response .= $row[0]."=".$row[1]."||";
    }
if($response) {
    $response = substr $response, 0, (length($response) - 2); 
    }    
unless($response) {
    $response = "invalid";
    }    
$sth->finish();
$dbh->disconnect();
    
print "Content-type: text/html\n\n";
print $response;  
