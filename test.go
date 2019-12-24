package main

import (
	"fmt"
)

type member struct {
	id int
}

func main() {
	member1 := &member{1}
	member2 := &member{2}
	member3 := &member{3}
	members := &[]member{}
	*members = append(*members, *member1)
	*members = append(*members, *member2)
	*members = append(*members, *member3)

	member4 := &member{4}
	member5 := &member{2}
	member6 := &member{6}
	members2 := &[]member{}
	*members2 = append(*members2, *member4)
	*members2 = append(*members2, *member5)
	*members2 = append(*members2, *member6)

	for iNew, vNew := range *members {
		for iOld, vOld := range *members2 {
			if vNew.id == vOld.id {
				*members2 = append(*members2[:iNew], *members2[iNew+1:]...)
			}
		}
	}

	fmt.Println(members, members2)
}
